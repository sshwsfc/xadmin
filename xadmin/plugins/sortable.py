#coding:utf-8
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView

SORTBY_VAR = '_sort_by'


class SortablePlugin(BaseAdminPlugin):

    sortable_fields = ['sort']

    # Media
    def get_media(self, media):
        if self.sortable_fields and self.request.GET.get(SORTBY_VAR):
            media = media + self.vendor('xadmin.plugin.sortable.js')
        return media

    # Block Views
    def block_top_toolbar(self, context, nodes):
        if self.sortable_fields:
            pass
            # current_refresh = self.request.GET.get(REFRESH_VAR)
            # context.update({
            #     'has_refresh': bool(current_refresh),
            #     'clean_refresh_url': self.admin_view.get_query_string(remove=(REFRESH_VAR,)),
            #     'current_refresh': current_refresh,
            #     'refresh_times': [{
            #         'time': r,
            #         'url': self.admin_view.get_query_string({REFRESH_VAR: r}),
            #         'selected': str(r) == current_refresh,
            #     } for r in self.refresh_times],
            # })
            # nodes.append(loader.render_to_string('xadmin/blocks/refresh.html', context_instance=context))


site.register_plugin(SortablePlugin, ListAdminView)
