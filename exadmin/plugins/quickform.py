from django.http import HttpResponse
from django.utils import simplejson
from django.utils.html import escape
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView

class QuickFormPlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        if self.request.method == 'GET' and self.request.is_ajax() or self.request.GET.get('_ajax'):
            self.admin_view.add_form_template = 'admin/quick_form.html'
            self.admin_view.change_form_template = 'admin/quick_form.html'

site.register_plugin(QuickFormPlugin, ModelFormAdminView)


