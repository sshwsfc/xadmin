

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

class EditPatchView(UpdateAdminView):

    def get_form_datas(self):
        params = {'instance': self.org_obj}
        if self.request_method == 'post':
            data = model_to_dict(self.org_obj)
            data.update(self.request.POST)
            params.update({'data': data, 'files': self.request.FILES})
        return params

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request, *args, **kwargs):
        self.instance_forms()
        form = self.form_obj
        result = {}
        if form.is_valid():
            form.save(commit=True)
            result['result'] = 'success'
        else:
            result['result'] = 'error'
            result['errors'] = []

        return self.render_response(result)

site.register_plugin(EditablePlugin, ListAdminView)
site.register_modelview(r'^(.+)/patch/$', EditPatchView, name='%s_%s_patch')


