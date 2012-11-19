from django.utils.translation import ugettext as _
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.cache import never_cache

from base import BaseAdminView
from exadmin.forms import AdminAuthenticationForm


class IndexView(BaseAdminView):

    @never_cache
    def get(self, request):
        context = self.get_context()
        context.update({
            'title': _('Site administration'),
            'app_list': [],
        })
        return self.template_response('admin/index.html', context)

class LoginView(BaseAdminView):

    @never_cache
    def get(self, request):
        from django.contrib.auth.views import login
        context = self.get_context()
        context.update({
            'title': _('Log in'),
            'app_path': request.get_full_path(),
            REDIRECT_FIELD_NAME: request.get_full_path(),
        })
        defaults = {
            'extra_context': context,
            'current_app': self.admin_site.name,
            'authentication_form': AdminAuthenticationForm,
            'template_name': 'admin/login.html',
        }
        return login(request, **defaults)

    @never_cache
    def post(self, request):
        return self.get(request)
        