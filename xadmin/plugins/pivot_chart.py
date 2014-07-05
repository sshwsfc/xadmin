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

def mock_for_field_label(obj):
    return obj

class PivotChartPlugin(BaseAdminPlugin):

    pivot_fields = []

    def result_item(self, __, obj, field_name, row):
        item = ResultItem(field_name, row)
        item.text = obj[field_name]
        return item

    def get_list_display(self, __):
        self.admin_view.list_display = ['log_time', 'click_count_sum']
        return __()

    def init_request(self, *args, **kwargs):
        self.admin_view.click_count_sum = mock_for_field_label
        self.admin_view.log_time = mock_for_field_label
        return bool(self.pivot_fields)

    def queryset(self, qs):
        return qs.values('log_time').annotate(click_count_sum=Sum('click_count'))

    # Media
    def get_media(self, media):
        # media.add_css({'screen': [self.static(
        #     'xadmin/css/xadmin.plugin.pivot.css'), ]})
        return media


site.register_plugin(PivotChartPlugin, ListAdminView)
