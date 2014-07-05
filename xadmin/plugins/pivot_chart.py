from django.db.models import FieldDoesNotExist, Avg, Max, Min, Count, Sum
from django.utils.translation import ugettext as _

from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView

from xadmin.views.list import ResultRow, ResultItem
from xadmin.util import display_for_field

AGGREGATE_METHODS = {
    'min': Min, 'max': Max, 'avg': Avg, 'sum': Sum, 'count': Count
}
AGGREGATE_TITLE = {
    'min': _('Min'), 'max': _('Max'), 'avg': _('Avg'), 'sum': _('Sum'), 'count': _('Count')
}


class PivotChartPlugin(BaseAdminPlugin):

    pivot_fields = []


    def get_list_display(self, __):
        self.admin_view.list_display = ['click_count_sum', 'download_count_sum']
        return __()

    def init_request(self, *args, **kwargs):
        return bool(self.pivot_fields)

    # Media
    def get_media(self, media):
        # media.add_css({'screen': [self.static(
        #     'xadmin/css/xadmin.plugin.pivot.css'), ]})
        return media


site.register_plugin(PivotChartPlugin, ListAdminView)
