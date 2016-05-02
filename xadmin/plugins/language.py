
from django.conf import settings
from django.template import loader, RequestContext
from django.utils.translation import check_for_language
from django.views.i18n import set_language

from xadmin.sites import site
from xadmin.models import UserSettings
from xadmin.views import BaseAdminPlugin, CommAdminView, BaseAdminView


class SetLangNavPlugin(BaseAdminPlugin):

    def block_top_navmenu(self, context, nodes):
        nodes.append(
            loader.render_to_string('xadmin/blocks/comm.top.setlang.html', {
                'redirect_to': self.request.get_full_path(),
            }, context_instance=RequestContext(self.request)))

class SetLangView(BaseAdminView):

    def post(self, request, *args, **kwargs):
        response = set_language(request)

        lang_code = request.POST.get('language', None)
        if lang_code and check_for_language(lang_code):
            us, created = UserSettings.objects.get_or_create(
                user=self.user, key='i18n-language')
            us.value = lang_code
            us.save()

        return response
    

if settings.LANGUAGES and 'django.middleware.locale.LocaleMiddleware' in settings.MIDDLEWARE_CLASSES:
    site.register_plugin(SetLangNavPlugin, CommAdminView)
    site.register_view(r'^i18n_set_language', SetLangView, 'i18n_set_language')
