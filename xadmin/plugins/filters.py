import operator, sys
from django.utils import six
from xadmin import widgets

from xadmin.util import get_fields_from_path, lookup_needs_distinct
from django.core.exceptions import SuspiciousOperation, ImproperlyConfigured, ValidationError
from django.db import models
from django.db.models.fields import FieldDoesNotExist
from django.db.models.fields.related import ForeignObjectRel
from django.db.models.sql.query import LOOKUP_SEP, QUERY_TERMS
from django.template import loader
from xadmin.compatibility import smart_str
from django.utils.translation import ugettext as _

from xadmin.filters import manager as filter_manager, FILTER_PREFIX, SEARCH_VAR, DateFieldListFilter, RelatedFieldSearchFilter
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView


if six.PY3:
    from functools import reduce

class IncorrectLookupParameters(Exception):
    pass


class FilterPlugin(BaseAdminPlugin):
    list_filter = ()
    search_fields = ()
    free_query_filter = True

    def lookup_allowed(self, lookup, value):
        model = self.model
        # Check FKey lookups that are allowed, so that popups produced by
        # ForeignKeyRawIdWidget, on the basis of ForeignKey.limit_choices_to,
        # are allowed to work.
        for l in model._meta.related_fkey_lookups:
            for k, v in widgets.url_params_from_lookup_dict(l).items():
                if k == lookup and v == value:
                    return True

        parts = lookup.split(LOOKUP_SEP)

        # Last term in lookup is a query term (__exact, __startswith etc)
        # This term can be ignored.
        if len(parts) > 1 and parts[-1] in QUERY_TERMS:
            parts.pop()

        # Special case -- foo__id__exact and foo__id queries are implied
        # if foo has been specificially included in the lookup list; so
        # drop __id if it is the last part. However, first we need to find
        # the pk attribute name.
        rel_name = None
        for part in parts[:-1]:
            try:
                field = model._meta.get_field(part)
            except FieldDoesNotExist:
                # Lookups on non-existants fields are ok, since they're ignored
                # later.
                return True
            if field.is_relation:
                model = field.related_model
                rel_name = field.rel.get_related_field().name
            elif isinstance(field, ForeignObjectRel):
                model = field.model
                rel_name = model._meta.pk.name
            else:
                rel_name = None
        if rel_name and len(parts) > 1 and parts[-1] == rel_name:
            parts.pop()

        if len(parts) == 1:
            return True
        clean_lookup = LOOKUP_SEP.join(parts)
        return clean_lookup in self.list_filter

    def get_list_queryset(self, queryset):
        lookup_params = dict([(smart_str(k)[len(FILTER_PREFIX):], v) for k, v in self.admin_view.params.items()
                              if smart_str(k).startswith(FILTER_PREFIX) and v != ''])
        for p_key, p_val in six.iteritems(lookup_params):
            if p_val == "False":
                lookup_params[p_key] = False
        use_distinct = False

        # for clean filters
        self.admin_view.has_query_param = bool(lookup_params)
        self.admin_view.clean_query_url = self.admin_view.get_query_string(remove=
                                                                           [k for k in self.request.GET.keys() if k.startswith(FILTER_PREFIX)])

        # Normalize the types of keys
        if not self.free_query_filter:
            for key, value in lookup_params.items():
                if not self.lookup_allowed(key, value):
                    raise SuspiciousOperation(
                        "Filtering by %s not allowed" % key)

        self.filter_specs = []
        if self.list_filter:
            for list_filter in self.list_filter:
                if callable(list_filter):
                    # This is simply a custom list filter class.
                    spec = list_filter(self.request, lookup_params, self.model, self)
                else:
                    field_path = None
                    field_parts = []
                    if isinstance(list_filter, (tuple, list)):
                        # This is a custom FieldListFilter class for a given field.
                        field, field_list_filter_class = list_filter
                    else:
                        # This is simply a field name, so use the default
                        # FieldListFilter class that has been registered for
                        # the type of the given field.
                        field, field_list_filter_class = list_filter, filter_manager.create
                    if not isinstance(field, models.Field):
                        field_path = field
                        field_parts = get_fields_from_path(
                            self.model, field_path)
                        field = field_parts[-1]
                    spec = field_list_filter_class(
                        field, self.request, lookup_params,
                        self.model, self.admin_view, field_path=field_path)

                    if len(field_parts)>1:
                        # Add related model name to title
                        spec.title = "%s %s"%(field_parts[-2].name,spec.title)

                    # Check if we need to use distinct()
                    use_distinct = (use_distinct or
                                    lookup_needs_distinct(self.opts, field_path))
                if spec and spec.has_output():
                    try:
                        new_qs = spec.do_filte(queryset)
                    except ValidationError:
                        import sys
                        e =  sys.exc_info()[1]
                        new_qs = None
                        self.admin_view.message_user(_("<b>Filtering error:</b> %s") % e.messages[0], 'error')
                    if new_qs is not None:
                        queryset = new_qs

                    self.filter_specs.append(spec)

        self.has_filters = bool(self.filter_specs)
        self.admin_view.filter_specs = self.filter_specs

        self.admin_view.used_filter_num = len( list(filter(lambda f: f.is_used, self.filter_specs)) )

        try:
            for key, value in lookup_params.items():
                use_distinct = (
                    use_distinct or lookup_needs_distinct(self.opts, key))
        except FieldDoesNotExist:
            import sys
            e =  sys.exc_info()[1]
            raise IncorrectLookupParameters(e)

        try:
            queryset = queryset.filter(**lookup_params)
        except (SuspiciousOperation, ImproperlyConfigured):
            raise
        except Exception:
            import sys
            e =  sys.exc_info()[1]
            raise IncorrectLookupParameters(e)

        query = self.request.GET.get(SEARCH_VAR, '')

        # Apply keyword searches.
        def construct_search(field_name):
            if field_name.startswith('^'):
                return "%s__istartswith" % field_name[1:]
            elif field_name.startswith('='):
                return "%s__iexact" % field_name[1:]
            elif field_name.startswith('@'):
                return "%s__search" % field_name[1:]
            else:
                return "%s__icontains" % field_name

        if self.search_fields and query:
            orm_lookups = [construct_search(str(search_field))
                           for search_field in self.search_fields]
            for bit in query.split():
                or_queries = [models.Q(**{orm_lookup: bit})
                              for orm_lookup in orm_lookups]
                queryset = queryset.filter(reduce(operator.or_, or_queries))
            if not use_distinct:
                for search_spec in orm_lookups:
                    if lookup_needs_distinct(self.opts, search_spec):
                        use_distinct = True
                        break
            self.admin_view.search_query = query

        if use_distinct:
            return queryset.distinct()
        else:
            return queryset

    # Media
    def get_media(self, media):
        if bool(filter(lambda s: isinstance(s, DateFieldListFilter), self.filter_specs)):
            media = media + self.vendor('datepicker.css', 'datepicker.js',
                                        'xadmin.widget.datetime.js')
        if bool(filter(lambda s: isinstance(s, RelatedFieldSearchFilter), self.filter_specs)):
            media = media + self.vendor(
                'select.js', 'select.css', 'xadmin.widget.select.js')
        return media + self.vendor('xadmin.plugin.filters.js')

    # Block Views
    def block_nav_menu(self, context, nodes):
        if self.has_filters:
            nodes.append(loader.render_to_string('xadmin/blocks/model_list.nav_menu.filters.html', context_instance=context))

    def block_nav_form(self, context, nodes):
        if self.search_fields:
            nodes.append(
                loader.render_to_string(
                    'xadmin/blocks/model_list.nav_form.search_form.html',
                    {'search_var': SEARCH_VAR,
                        'remove_search_url': self.admin_view.get_query_string(remove=[SEARCH_VAR]),
                        'search_form_params': self.admin_view.get_form_params(remove=[SEARCH_VAR])},
                    context_instance=context))

site.register_plugin(FilterPlugin, ListAdminView)
