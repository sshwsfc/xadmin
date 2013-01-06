# coding=UTF-8
from django.core.urlresolvers import reverse
from django.utils.encoding import force_unicode
from django.utils.encoding import smart_str
from django.utils.safestring import mark_safe
from django.db.models.sql.constants import LOOKUP_SEP
from django.db.models.related import RelatedObject
from django.db import models

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, CreateAdminView, UpdateAdminView, DeleteAdminView

RELATE_PREFIX = '_rel_'

class RelateMenuPlugin(BaseAdminPlugin):

    related_list = []
    use_related_menu = True

    def get_related_list(self):
        if hasattr(self, '_related_acts'):
            return self._related_acts
            
        _related_acts = []
        for r in self.opts.get_all_related_objects() + self.opts.get_all_related_many_to_many_objects():
            if self.related_list and (r.get_accessor_name() not in self.related_list):
                continue
            if r.model not in self.admin_site._registry.keys():
                continue
            f = r.field
            rel_name = f.rel.get_related_field().name
            _related_acts.append((r.opts.app_label, r.opts.module_name, force_unicode(r.opts.verbose_name), f.name, '%s__%s__exact' % (f.name, rel_name)))

        self._related_acts = _related_acts
        return self._related_acts
    
    def related_link(self, instance):
        links =[]
        for label, model_name, verbose_name, field_name, lookup_name in self.get_related_list():
            list_url = reverse('%s:%s_%s_changelist' % (self.admin_site.app_name, label, model_name))
            add_url = reverse('%s:%s_%s_add' % (self.admin_site.app_name, label, model_name))
            link = ''.join(('<li class="with_menu_btn">',
            '<a href="%s?%s=%s" title="%s"><i class="icon icon-th-list"></i> %s</a>' % \
                (list_url, RELATE_PREFIX + lookup_name, str(instance.pk), verbose_name, verbose_name), ' ',
            '<a class="add_link dropdown-menu-btn" href="%s?%s=%s"><i class="icon icon-plus pull-right"></i></a>' % \
                (add_url, RELATE_PREFIX + lookup_name, str(instance.pk)),
             '</li>'))
            links.append(link)
        ul_html = '<ul class="dropdown-menu" role="menu">%s</ul>' % ''.join(links)
        return '<div class="dropdown related_menu pull-left"><a class="relate_menu dropdown-toggle" data-toggle="dropdown"><i class="icon icon-list"></i></a>%s</div>' % ul_html
    related_link.short_description = '&nbsp;'
    related_link.allow_tags = True

    def get_list_display(self, list_display):
        if self.use_related_menu and len(self.get_related_list()):
            list_display.append('related_link')
            self.admin_view.related_link = self.related_link
        return list_display

class RelateObject(object):

    def __init__(self, admin_view, lookup, value):
        self.admin_view = admin_view
        self.org_model = admin_view.model
        self.opts = admin_view.opts
        self.lookup = lookup
        self.value = value

        parts = lookup.split(LOOKUP_SEP)
        field = self.opts.get_field(parts[0])

        if not hasattr(field, 'rel') and not isinstance(field, RelatedObject):
            raise Exception(u'Relate Lookup field must a related field')

        if hasattr(field, 'rel'):
            self.to_model = field.rel.to
            self.rel_name = field.rel.get_related_field().name
            self.is_m2m = isinstance(field.rel, models.ManyToManyRel)
        else:
            self.to_model = field.model
            self.rel_name = self.to_model._meta.pk.name
            self.is_m2m = False

        to_qs = self.to_model._default_manager.get_query_set()
        self.to_objs = to_qs.filter(**{self.rel_name: value}).all()

        self.field = field

    def filter(self, queryset):
        return queryset.filter(**{self.lookup: self.value})

    def get_brand_name(self):
        if len(self.to_objs) == 1:
            to_model_name = str(self.to_objs[0])
        else:
            to_model_name = force_unicode(self.to_model._meta.verbose_name)

        return mark_safe(u"<span class='rel-brand'>%s's</span> %s" % (to_model_name, force_unicode(self.opts.verbose_name)))
        

class BaseRelateDisplayPlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        self.relate_obj = None
        for k, v in self.request.REQUEST.items():
            if smart_str(k).startswith(RELATE_PREFIX):
                self.relate_obj = RelateObject(self.admin_view, smart_str(k)[len(RELATE_PREFIX):], v)
                break
        return bool(self.relate_obj)

    def _get_relate_params(self):
        return RELATE_PREFIX + self.relate_obj.lookup, self.relate_obj.value

    def _get_input(self):
        return '<input type="hidden" name="%s" value="%s" />' % self._get_relate_params()

    def _get_url(self, url):
        return url + ('&' if url.find('?') > 0 else '?') + ('%s=%s' % self._get_relate_params())

class ListRelateDisplayPlugin(BaseRelateDisplayPlugin):

    def get_list_queryset(self, queryset):
        if self.relate_obj:
            queryset = self.relate_obj.filter(queryset)
        return queryset

    def url_for_result(self, url, result):
        return self._get_url(url)

    def get_context(self, context):
        context['brand_name'] = self.relate_obj.get_brand_name()
        if context.has_key('add_url'):
            context['add_url'] = self._get_url(context['add_url'])
        return context

    def get_list_display(self, list_display):
        if not self.relate_obj.is_m2m:
            list_display.remove(self.relate_obj.field.name)
        return list_display

class EditRelateDisplayPlugin(BaseRelateDisplayPlugin):

    def get_form_datas(self, datas):
        if self.admin_view.org_obj is None and self.admin_view.request_method == 'get':
            datas['initial'][self.relate_obj.field.name] = self.relate_obj.value
        return datas

    def post_response(self, response):
        if isinstance(response, basestring) and response != self.admin_urlname('index'):
            return self._get_url(response)
        return response

    def get_context(self, context):
        if context.has_key('delete_url'):
            context['delete_url'] = self._get_url(context['delete_url'])
        return context

    def block_after_fieldsets(self, context, nodes):
        return self._get_input()

class DeleteRelateDisplayPlugin(BaseRelateDisplayPlugin):

    def post_response(self, response):
        if isinstance(response, basestring) and response != self.admin_urlname('index'):
            return self._get_url(response)
        return response

    def block_form_fields(self, context, nodes):
        return self._get_input()

site.register_plugin(RelateMenuPlugin, ListAdminView)
site.register_plugin(ListRelateDisplayPlugin, ListAdminView)
site.register_plugin(EditRelateDisplayPlugin, CreateAdminView)
site.register_plugin(EditRelateDisplayPlugin, UpdateAdminView)
site.register_plugin(DeleteRelateDisplayPlugin, DeleteAdminView)


