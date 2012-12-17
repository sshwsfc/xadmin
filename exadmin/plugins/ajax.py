from django.http import HttpResponse
from django.utils import simplejson
from django.utils.html import escape
from django import forms
from django.conf import settings
from django.utils.html import conditional_escape
from django.utils.encoding import StrAndUnicode, force_unicode
from django.utils.safestring import mark_safe
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils.datastructures import SortedDict

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, ModelFormAdminView, DetailAdminView

NON_FIELD_ERRORS = '__all__'

class AjaxListPlugin(BaseAdminPlugin):

    def get_result_list(self, response):
        if not (self.request.is_ajax() or self.request.GET.get('_ajax')):
            return response

        av = self.admin_view
        base_fields = av.base_list_display
        headers = dict([(c.field_name, c.text) for c in av.result_headers().cells if c.field_name in base_fields])

        objects = [dict([(o.field_name, escape(str(o.value))) for i,o in \
            enumerate(filter(lambda c:c.field_name in base_fields, r.cells))]) \
            for r in av.results()]

        return self.render_response({'headers': headers, 'objects': objects, 'total_count': av.result_count, 'has_more': av.has_more})

class JsonErrorDict(forms.util.ErrorDict):

    def __init__(self, errors, form):
        super(JsonErrorDict, self).__init__(errors)
        self.form = form

    def as_json(self):
        if not self: return u''
        return [{'id': self.form[k].auto_id if k != NON_FIELD_ERRORS else NON_FIELD_ERRORS,'name': k,'errors': v} for k,v in self.items()]

class AjaxFormPlugin(BaseAdminPlugin):

    def post_response(self, __):
        if not (self.request.is_ajax() or self.request.POST.get('_ajax')):
            return __()

        return self.render_response({'result': 'success'})

    def get_response(self, __):
        if self.request.method.lower() != 'post' or not (self.request.is_ajax() or self.request.POST.get('_ajax')):
            return __()

        result = {}
        form = self.admin_view.form_obj
        if form.is_valid():
            result['result'] = 'success'
        else:
            result['result'] = 'error'
            result['errors'] = JsonErrorDict(form.errors, form).as_json()

        return self.render_response(result)

class AjaxDetailPlugin(BaseAdminPlugin):

    def get_response(self, __):
        if not (self.request.is_ajax() or self.request.GET.get('_ajax')):
            return __()

        form = self.admin_view.form_obj
        layout = form.helper.layout

        result = SortedDict([(form[f].label, self.admin_view.get_field_value(f)) for p, f in layout.get_field_names()])

        return self.render_response(result)

site.register_plugin(AjaxListPlugin, ListAdminView)
site.register_plugin(AjaxFormPlugin, ModelFormAdminView)
site.register_plugin(AjaxDetailPlugin, DetailAdminView)


