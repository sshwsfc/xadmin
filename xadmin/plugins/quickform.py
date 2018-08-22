from django.db import models
from django import forms
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from django.forms.models import modelform_factory
import copy
from xadmin.sites import site
from xadmin.util import get_model_from_relation, vendor
from xadmin.views import BaseAdminPlugin, ModelFormAdminView
from xadmin.layout import Layout
import re


class QuickFormPlugin(BaseAdminPlugin):
    inline_field_pattern = re.compile('\w+-\d+-(?P<field>\w+)')

    def init_request(self, *args, **kwargs):
        if self.request.method == 'GET' and self.request.is_ajax() or self.request.GET.get('_ajax'):
            self.patch_request_get()
            self.admin_view.add_form_template = 'xadmin/views/quick_form.html'
            self.admin_view.change_form_template = 'xadmin/views/quick_form.html'
            return True
        return False

    def resolve_field_if_inline(self, field):
        match = self.inline_field_pattern.match(field)
        return match.groupdict()['field'] if match else field

    def patch_request_get(self):
        """Need to convert the inline field format to the value that a template field.
        Ex: model-0-field -> field
        """
        data = self.request.GET.copy()
        field_key = '_field'
        if field_key in data:
            _fields = data[field_key].split(',')
            data[field_key] = []
            for field in _fields:
                field_name = self.resolve_field_if_inline(field)

                data[field_key].append(field_name)
                data[field_name] = data[field]

                # Save the original field name to restore there in the widget
                data['_field_inline_' + field_name] = field
            data[field_key] = ','.join(data[field_key])
        self.request.GET = data

    def get_model_form(self, __, **kwargs):
        if '_field' in self.request.GET:
            defaults = {
                "form": self.admin_view.form,
                "fields": self.request.GET['_field'].split(','),
                "formfield_callback": self.admin_view.formfield_for_dbfield,
            }
            return modelform_factory(self.model, **defaults)
        return __()

    def get_form_layout(self, __):
        if '_field' in self.request.GET:
            return Layout(*self.request.GET['_field'].split(','))
        return __()

    def get_context(self, context):
        context['form_url'] = self.request.path
        return context


class RelatedFieldWidgetWrapper(forms.Widget):
    """
    This class is a wrapper to a given widget to add the add icon for the
    admin interface.
    """
    def __init__(self, widget, rel, add_url, rel_add_url, **kwargs):
        self.needs_multipart_form = widget.needs_multipart_form
        self.attrs = widget.attrs
        self.choices = widget.choices
        self.is_required = widget.is_required
        self.widget = widget
        self.rel = rel

        self.add_url = add_url
        self.rel_add_url = rel_add_url

        if hasattr(self, 'input_type'):
            self.input_type = widget.input_type

        self.kwargs = kwargs

    def __deepcopy__(self, memo):
        obj = copy.copy(self)
        obj.widget = copy.deepcopy(self.widget, memo)
        obj.attrs = self.widget.attrs
        memo[id(self)] = obj
        return obj

    @property
    def media(self):
        media = self.widget.media + vendor('xadmin.plugin.quick-form.js')
        return media

    def resolve_field_name_if_inline(self, name):
        """When the original field is an inline the name should be changed to the original."""
        new_name = self.kwargs.get('_field_inline_' + name)
        return (new_name and new_name[0]) or name

    def render(self, name, value, renderer=None, *args, **kwargs):
        name = self.resolve_field_name_if_inline(name)
        self.widget.choices = self.choices
        output = []
        if self.add_url:
            output.append(u'<a href="%s" title="%s" class="btn btn-primary btn-sm btn-ajax pull-right" data-for-id="id_%s" data-refresh-url="%s"><i class="fa fa-plus"></i></a>'
                          % (
                              self.add_url, (_('Create New %s') % self.rel.model._meta.verbose_name), name,
                              "%s?_field=%s&%s=" % (self.rel_add_url, name, name)))
        output.extend(['<div class="control-wrap" id="id_%s_wrap_container">' % name,
                       self.widget.render(name, value, *args, **kwargs), '</div>'])
        return mark_safe(u''.join(output))

    def build_attrs(self, extra_attrs=None, **kwargs):
        "Helper function for building an attribute dictionary."
        self.attrs = self.widget.build_attrs(extra_attrs=None, **kwargs)
        return self.attrs

    def value_from_datadict(self, data, files, name):
        return self.widget.value_from_datadict(data, files, name)

    def id_for_label(self, id_):
        return self.widget.id_for_label(id_)


class QuickAddBtnPlugin(BaseAdminPlugin):

    def formfield_for_dbfield(self, formfield, db_field, **kwargs):
        if formfield and self.model in self.admin_site._registry and isinstance(db_field, (models.ForeignKey, models.ManyToManyField)):
            rel_model = get_model_from_relation(db_field)
            if rel_model in self.admin_site._registry and self.has_model_perm(rel_model, 'add'):
                add_url = self.get_model_url(rel_model, 'add')
                formfield.widget = RelatedFieldWidgetWrapper(
                    formfield.widget, db_field.remote_field, add_url, self.get_model_url(self.model, 'add')),
                    ** self.request.GET)
        return formfield

site.register_plugin(QuickFormPlugin, ModelFormAdminView)
site.register_plugin(QuickAddBtnPlugin, ModelFormAdminView)
