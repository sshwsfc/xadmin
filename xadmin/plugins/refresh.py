# coding=utf-8
"""
列表定时刷新
============
 
功能
----
 
该插件在数据列表页面提供了定时刷新功能, 对于需要实时刷新列表页面查看即时数据的情况非常有用.
 
截图
----
 
.. image:: /images/plugins/refresh.png
 
使用
----
 
使用数据刷新插件非常简单, 设置 OptionClass 的 ``refresh_times`` 属性即可. ``refresh_times`` 属性是存有刷新时间的数组. xadmin 默认不开启该插件.
示例如下::
 
    class MyModelAdmin(object):
        
        # 这会显示一个下拉列表, 用户可以选择3秒或5秒刷新一次页面.
        refresh_times = (3, 5)
 
"""
from django.template import loader

from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView

REFRESH_VAR = '_refresh'


class RefreshPlugin(BaseAdminPlugin):

    refresh_times = []

    # Media
    def get_media(self, media):
        if self.refresh_times and self.request.GET.get(REFRESH_VAR):
            media = media + self.vendor('xadmin.plugin.refresh.js')
        return media

    # Block Views
    def block_top_toolbar(self, context, nodes):
        if self.refresh_times:
            current_refresh = self.request.GET.get(REFRESH_VAR)
            context.update({
                'has_refresh': bool(current_refresh),
                'clean_refresh_url': self.admin_view.get_query_string(remove=(REFRESH_VAR,)),
                'current_refresh': current_refresh,
                'refresh_times': [{
                    'time': r,
                    'url': self.admin_view.get_query_string({REFRESH_VAR: r}),
                    'selected': str(r) == current_refresh,
                } for r in self.refresh_times],
            })
            nodes.append(loader.render_to_string('xadmin/blocks/model_list.top_toolbar.refresh.html', context_instance=context))


site.register_plugin(RefreshPlugin, ListAdminView)
