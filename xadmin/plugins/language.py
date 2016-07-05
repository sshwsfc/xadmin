
from django.conf import settings
from django.template import loader
from xadmin.plugins.utils import get_context_dict
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, CommAdminView


class SetLangNavPlugin(BaseAdminPlugin):

    def block_top_navmenu(self, context, nodes):
        context = get_context_dict(context)
        context['redirect_to'] = self.request.get_full_path()
        nodes.append(loader.render_to_string('xadmin/blocks/comm.top.setlang.html', context=context))

if settings.LANGUAGES and 'django.middleware.locale.LocaleMiddleware' in settings.MIDDLEWARE_CLASSES:
    site.register_plugin(SetLangNavPlugin, CommAdminView)
    site.register_view(r'^i18n/', lambda site: 'django.conf.urls.i18n', 'i18n')
