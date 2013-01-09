from django import forms
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.db import models, transaction
from django.forms.models import modelform_factory
from django.http import Http404
from django.template import loader
from django.utils.encoding import force_unicode, smart_unicode
from django.utils.html import escape, conditional_escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from exadmin.plugins.ajax import JsonErrorDict
from exadmin.sites import site
from exadmin.util import lookup_field, display_for_field, label_for_field, unquote, boolean_icon
from exadmin.views import BaseAdminPlugin, ModelFormAdminView, ListAdminView
from exadmin.views.base import csrf_protect_m
from exadmin.views.edit import ModelFormAdminUtil
from exadmin.views.list import EMPTY_CHANGELIST_VALUE


class EditablePlugin(BaseAdminPlugin):

    list_editable = []

    def __init__(self, admin_view):
        super(EditablePlugin, self).__init__(admin_view)
        self.editable_need_fields = {}

    def init_request(self, *args, **kwargs):
        active = bool(self.request.method == 'GET' and self.list_editable)
        if active:
            self.model_form_admins = {}
        return active

    def _get_form_admin(self, obj):
        if not self.model_form_admins.has_key(obj):
            self.model_form_admins[obj] = self.get_model_view(ModelFormAdminUtil, self.model, obj)
        return self.model_form_admins[obj]

    def result_item(self, item, obj, field_name, row):
        if self.list_editable and item.field and item.field.editable and (field_name in self.list_editable):
            pk = getattr(obj, obj._meta.pk.attname)
            form = self._get_form_admin(obj).form_obj
            form.prefix = str(pk)

            field_label = label_for_field(field_name, obj,
                model_admin = self.admin_view,
                return_attr = False
            )
            data_attr = {
                'name': field_name,
                'action': self.admin_view.model_admin_urlname('patch', pk),
                'title': _(u"Enter %s") % field_label,
                'field': form[field_name]
            }
            item.wraps.insert(0, '<span class="editable-field">%s</span>')
            item.btns.append(loader.render_to_string('admin/blocks/editable.html', data_attr))

            if not self.editable_need_fields.has_key(field_name):
                self.editable_need_fields[field_name] = item.field
        return item

    # Media
    def get_media(self, media):
        if self.editable_need_fields:
            media = media + self.model_form_admins.values()[0].media
            media.add_js([self.static('exadmin/js/editable.js')])
            media.add_css({'screen': [self.static('exadmin/css/editable.css'),]})
        return media

class EditPatchView(ModelFormAdminView, ListAdminView):

    def get_new_field_html(self, f):
        result = self.result_item(self.org_obj, f, {'is_display_first': False, 'object': self.org_obj})
        return mark_safe(result.text) if result.allow_tags else conditional_escape(result.text)

    def _get_new_field_html(self, field_name):
        try:
            f, attr, value = lookup_field(field_name, self.org_obj, self)
        except (AttributeError, ObjectDoesNotExist):
            return EMPTY_CHANGELIST_VALUE
        else:
            allow_tags = False
            if f is None:
                allow_tags = getattr(attr, 'allow_tags', False)
                boolean = getattr(attr, 'boolean', False)
                if boolean:
                    allow_tags = True
                    text = boolean_icon(value)
                else:
                    text = smart_unicode(value)
            else:
                if isinstance(f.rel, models.ManyToOneRel):
                    field_val = getattr(self.org_obj, f.name)
                    if field_val is None:
                        text = EMPTY_CHANGELIST_VALUE
                    else:
                        text = field_val
                else:
                    text = display_for_field(value, f)
            return mark_safe(text) if allow_tags else conditional_escape(text)

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request, object_id):

        self.org_obj = self.get_object(unquote(object_id))

        if not self.has_change_permission(self.org_obj):
            raise PermissionDenied

        if self.org_obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % \
                {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        pk = getattr(self.org_obj, self.org_obj._meta.pk.attname)
        model_fields = [str(pk) + '-' + f.name for f in self.opts.fields]
        fields = [f[len(str(pk)) + 1:] for f in request.POST.keys() if f in model_fields]

        defaults = {
            "form": forms.ModelForm,
            "fields": fields,
            "formfield_callback": self.formfield_for_dbfield,
        }
        form_class = modelform_factory(self.model, **defaults)
        form = form_class(instance=self.org_obj, data=request.POST, files=request.FILES)
        form.prefix = str(pk)

        result = {}
        if form.is_valid():
            form.save(commit=True)
            result['result'] = 'success'
            result['new_data'] = form.cleaned_data
            result['new_html'] = dict([(f, self.get_new_field_html(f)) for f in fields])
        else:
            result['result'] = 'error'
            result['errors'] = JsonErrorDict(form.errors, form).as_json()

        return self.render_response(result)

site.register_plugin(EditablePlugin, ListAdminView)
site.register_modelview(r'^(.+)/patch/$', EditPatchView, name='%s_%s_patch')


