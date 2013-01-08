

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.db import models
from django import forms
from django.forms.models import modelform_factory
from django.http import Http404
from django.template import loader
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode, smart_unicode
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from django.utils.html import conditional_escape
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.db import models
from django.template import loader
from django.utils import simplejson
from django.db import transaction
from django.contrib.contenttypes.generic import GenericInlineModelAdmin, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied
from django.db import models
from django.db.models.query import QuerySet
from django.db.models.related import RelatedObject
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _
from django.forms import model_to_dict
from exadmin.layout import Field, render_field
from exadmin.plugins.actions import BaseActionView
from exadmin.plugins.inline import InlineModelAdmin
from exadmin.plugins.ajax import JsonErrorDict
from exadmin.sites import site
from exadmin.util import unquote, quote, model_format_dict
from exadmin.views import BaseAdminPlugin, ModelAdminView, CreateAdminView, UpdateAdminView, DetailAdminView, ModelFormAdminView, DeleteAdminView, ListAdminView
from exadmin.views.base import csrf_protect_m, filter_hook
from exadmin.views.edit import ModelFormAdminUtil
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, api_manager
from exadmin.util import label_for_field

class EditablePlugin(BaseAdminPlugin):

    list_editable = []

    def __init__(self, admin_view):
        super(EditablePlugin, self).__init__(admin_view)
        self.editable_need_fields = {}

    def init_request(self, *args, **kwargs):
        if self.list_editable:
            self.model_form_admins = {}
        return bool(self.list_editable)

    def _get_form_admin(self, obj):
        if not self.model_form_admins.has_key(obj):
            self.model_form_admins[obj] = self.get_model_view(ModelFormAdminUtil, self.model, obj)
        return self.model_form_admins[obj]

    def result_item(self, item, obj, field_name, row):
        if self.list_editable and item.field and item.field.editable and (field_name in self.list_editable):
            form = self._get_form_admin(obj).form_obj

            field_label = label_for_field(field_name, obj,
                model_admin = self.admin_view,
                return_attr = False
            )
            data_attr = {
                'name': field_name,
                'action': self.admin_view.model_admin_urlname('patch', getattr(obj, obj._meta.pk.attname)),
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

class EditPatchView(ModelFormAdminView):

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request, object_id):

        self.org_obj = self.get_object(unquote(object_id))

        if not self.has_change_permission(self.org_obj):
            raise PermissionDenied

        if self.org_obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % \
                {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        fields = [f.name for f in self.opts.fields]
        defaults = {
            "form": forms.ModelForm,
            "fields": [f for f in request.POST.keys() if f in fields],
            "formfield_callback": self.formfield_for_dbfield,
        }
        form_class = modelform_factory(self.model, **defaults)
        form = form_class(instance=self.org_obj, data=request.POST, files=request.FILES)

        result = {}
        if form.is_valid():
            form.save(commit=True)
            result['result'] = 'success'
            result['new_data'] = form.cleaned_data
        else:
            result['result'] = 'error'
            result['errors'] = JsonErrorDict(form.errors, form).as_json()

        return self.render_response(result)

site.register_plugin(EditablePlugin, ListAdminView)
site.register_modelview(r'^(.+)/patch/$', EditPatchView, name='%s_%s_patch')


