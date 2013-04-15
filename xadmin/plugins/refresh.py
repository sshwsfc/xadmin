# coding=utf-8
"""
数据刷新
========

功能
----

该插件在数据列表页面提供了数据导出功能, 可以导出 Excel, CSV, XML, json 格式.

截图
----

.. image:: /images/plugins/export.png

使用
----

.. note:: 如果想要导出 Excel 数据, 需要安装 `xlwt <http://pypi.python.org/pypi/xlwt>`_.

默认情况下, xadmin 会提供 Excel, CSV, XML, json 四种格式的数据导出. 您可以通过设置 OptionClass 的 ``list_export`` 属性来指定使用
哪些导出格式 (四种各使用分别用 ``xls``, ``csv``, ``xml``, ``json`` 表示), 或是将 ``list_export`` 设置为 ``None`` 来禁用数据导出功能. 示例如下::

    class MyModelAdmin(object):

        list_export = ('xls', xml', 'json')

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
            media.add_js([self.static('xadmin/js/refresh.js')])
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
            nodes.append(loader.render_to_string('xadmin/blocks/refresh.html', context_instance=context))


site.register_plugin(RefreshPlugin, ListAdminView)


