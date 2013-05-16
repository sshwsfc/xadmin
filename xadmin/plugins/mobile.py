
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, CommAdminView

class MobilePlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        return True

    def get_context(self, context):
        context['base_template'] = 'xadmin/base_mobile.html'
        context['is_mob'] = True
        return context

site.register_plugin(MobilePlugin, CommAdminView)
