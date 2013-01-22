from django.utils.translation import ugettext as _
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.cache import never_cache
from django.contrib.auth.views import login
from django.contrib.auth.views import logout
from django.http import HttpResponse

from base import BaseAdminView
from dashboard import Dashboard
from exadmin.forms import AdminAuthenticationForm
from exadmin.models import UserSettings


class IndexView(Dashboard):
    title = _(u"Main Dashboard")
    icon = "dashboard"

class UserSettingView(BaseAdminView):

    @never_cache
    def post(self, request):
        key = request.POST['key']
        val = request.POST['value']
        us, created = UserSettings.objects.get_or_create(user=self.user, key=key)
        us.value = val
        us.save()
        return HttpResponse('')

class LoginView(BaseAdminView):

    @never_cache
    def get(self, request, *args, **kwargs):
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
    def post(self, request, *args, **kwargs):
        return self.get(request)

class LogoutView(BaseAdminView):

    logout_template = None

    @never_cache
    def get(self, request, *args, **kwargs):
        context = self.get_context()
        defaults = {
            'extra_context': context,
            'current_app': self.admin_site.name,
        }
        if self.logout_template is not None:
            defaults['template_name'] = self.logout_template

        return logout(request, **defaults)

    @never_cache
    def post(self, request, *args, **kwargs):
        return self.get(request)


        