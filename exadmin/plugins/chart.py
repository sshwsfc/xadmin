
from django.contrib.admin.templatetags.admin_static import static
from django.template import loader

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelAdminView, ListAdminView

class ChartsPlugin(BaseAdminPlugin):

    data_charts = ['q']

    # Media
    def get_media(self, media):
        if self.data_charts:
            media.add_js([static('exadmin/js/jquery.flot.js')])
            media.add_js([static('exadmin/js/jquery.flot.pie.js')])
            media.add_js([static('exadmin/js/jquery.flot.resize.js')])
            media.add_js([static('exadmin/js/charts.js')])
        return media

    # Block Views
    def block_results_top(self, context, nodes):
        if self.data_charts:
            nodes.append(loader.render_to_string('admin/blocks/charts.html', context_instance=context))

class ChartsView(ModelAdminView):

    def get(self, request):
        content = {'data': [], 'option': {}}
        return self.render_response(content)

site.register_plugin(ChartsPlugin, ListAdminView)
site.register_modelview(r'^chart/$', ChartsView, name='%s_%s_chart')


