import datetime
import decimal
import calendar
import time

from django.template import loader
from django.http import HttpResponseNotFound
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils.encoding import smart_unicode
from django.db import models
from django.utils.translation import ugettext_lazy as _, ugettext

from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView
from xadmin.views.dashboard import ModelBaseWidget, widget_manager, PartialBaseWidget
from xadmin.util import lookup_field, label_for_field, force_unicode, json


@widget_manager.register
class ChartWidget(ModelBaseWidget, PartialBaseWidget):
    widget_type = 'chart'
    description = _('Show models simple chart.')
    template = 'xadmin/widgets/chart.html'

    def convert(self, data):
        self.list_params = data.pop('params', {})
        self.chart = data.pop('chart', None)

    def setup(self):
        super(ChartWidget, self).setup()

        self.charts = {}
        self.one_chart = False
        model_admin = self.admin_site._registry[self.model]
        chart = self.chart

        if hasattr(model_admin, 'data_charts'):
            if chart and chart in model_admin.data_charts:
                self.charts = {chart: model_admin.data_charts[chart]}
                self.one_chart = True
                if self.title is None:
                    self.title = model_admin.data_charts[chart].get('title')
            else:
                self.charts = model_admin.data_charts
                if self.title is None:
                    self.title = ugettext(
                        "%s Charts") % self.model._meta.verbose_name_plural

        req = self.make_get_request("", self.list_params)
        self.list_view = self.get_view_class(ListAdminView, self.model)(req)

    def filte_choices_model(self, model, modeladmin):
        return bool(getattr(modeladmin, 'data_charts', None)) and \
            super(ChartWidget, self).filte_choices_model(model, modeladmin)

    def context(self, context):

        list_view = self.list_view
        list_view.make_result_list()

        for name, v in self.charts.items():
            chartname = name

        self.mychart = list_view.data_charts[chartname]

        self.x_field = self.mychart['x-field']
        y_fields = self.mychart['y-field']
        self.y_fields = (
            y_fields,) if type(y_fields) not in (list, tuple) else y_fields

        datas = [{"data":[], 'yAxis': '1', "key": force_unicode(label_for_field(
            i, self.model, model_admin=self))} for i in self.y_fields]

        #TODO: not needed 2 times
        list_view.make_result_list()

        tooltip_date = "%d %b %Y %H:%M"
        extra_serie = {"tooltip": {"y_start": "", "y_end": ""},
                       "date_format": tooltip_date}

        ydata = {}
        for i, yfname in enumerate(self.y_fields):
            k = i + 1
            ydata[yfname] = {'name%d' % k: yfname, 'y%d' % k: None, 'extra%d' % k: extra_serie}

        xdata = []

        for obj in list_view.result_list:
            xf, attrs, value = lookup_field(self.x_field, obj, self)
            for i, yfname in enumerate(self.y_fields):
                k = i + 1
                lkey = 'y%d' % k
                yf, yattrs, yv = lookup_field(yfname, obj, self)
                datas[i]["data"].append((value, yv))
                # timevalue = int(time.mktime(datetime.datetime(2012, 6, 1).timetuple()) * 1000)
                xtime = int(time.mktime((value.timetuple())) * 1000)
                if xtime not in xdata:
                    xdata.append(xtime)
                if not ydata[yfname][lkey]:
                    ydata[yfname][lkey] = []
                ydata[yfname][lkey].append(yv)

        # build chartdata similar to:
        # chartdata = {'x': xdata,
        #              'name1': 'series 1', 'y1': ydata, 'extra1': extra_serie,
        #              'name2': 'series 2', 'y2': ydata2, 'extra2': extra_serie}
        chartdata = {'x': xdata}
        #merge the dictionaries
        for i, yfname in enumerate(self.y_fields):
            chartdata.update(ydata[yfname])

        # charts settings
        charttype = "lineChart"
        extra = {
            'x_is_date': True,
            'x_axis_format': '%d %b %Y',
            'tag_script_js': True,
            'jquery_on_ready': True,
            'y_axis_format': '.0f',
        }

        context.update({
            'charts': [{"name": name, "charttype": charttype, "chartdata": chartdata, "extra": extra, "title": v['title']} for name, v in self.charts.items()],
        })

    # Media
    def media(self):
        return self.vendor('nvd3.js', 'nvd3.css', 'xadmin.plugin.charts.js')


# >>> dir(self)
# ['__class__', '__delattr__', '__dict__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__module__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', 'admin_site', 'admin_view', 'args', 'block_results_top', 'data_charts', 'get_admin_url', 'get_form_params', 'get_media', 'get_model_perm', 'get_model_url', 'get_model_view', 'get_query_string', 'get_view', 'has_model_perm', 'init_request', 'kwargs', 'message_user', 'model', 'opts', 'render_response', 'request', 'static', 'template_response', 'user', 'vendor'  ]
# >>> self.get_query_string
# <bound method appaccessrecordAdminChartsPlugin.get_query_string of <xadmin.sites.appaccessrecordAdminChartsPlugin object at 0x7f6a605f0650>>

class ChartsPlugin(BaseAdminPlugin):

    data_charts = {}

    def init_request(self, *args, **kwargs):
        return bool(self.data_charts)

    def get_chart_url(self, name, v):
        return self.admin_view.model_admin_url('chart', name) + self.admin_view.get_query_string()

    # Media
    def get_media(self, media):
        return media + self.vendor('nvd3.js', 'nvd3.css', 'xadmin.plugin.charts.js')

    # Block Views
    def block_results_top(self, context, nodes):
        chartdata = {'x': 1}
        # charts settings
        charttype = "lineChart"
        extra = {
            'x_is_date': True,
            'x_axis_format': '%d %b %Y',
            'tag_script_js': True,
            'jquery_on_ready': True,
            'y_axis_format': '.0f',
        }
        context.update({
            'charts': [{"name": name, "charttype": charttype, "chartdata": chartdata, "extra": extra, "title": v['title'], 'url': self.get_chart_url(name, v)} for name, v in self.data_charts.items()],
        })
        nodes.append(loader.render_to_string('xadmin/blocks/model_list.results_top.charts.html', context_instance=context))


# From xadmin.py ::
    # data_charts = {
    #     "user_count": {'title': u"User Report", "x-field": "date", "y-field": ("user_count", "view_count"), "order": ('date',)},
    #     "avg_count": {'title': u"Avg Report", "x-field": "date", "y-field": ('avg_count',), "order": ('date',)}
    # }


#TODO: we can remove this as replace by above class not using json url
class JSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, (datetime.date, datetime.datetime)):
            return calendar.timegm(o.timetuple()) * 1000
        elif isinstance(o, decimal.Decimal):
            return str(o)
        else:
            try:
                return super(JSONEncoder, self).default(o)
            except Exception:
                return smart_unicode(o)


#TODO: we can remove this as replace by above class not using json url
class ChartsView(ListAdminView):

    data_charts = {}

    def get_ordering(self):
        if 'order' in self.chart:
            return self.chart['order']
        else:
            return super(ChartsView, self).get_ordering()

    def get(self, request, name):
        if name not in self.data_charts:
            return HttpResponseNotFound()

        self.chart = self.data_charts[name]

        self.x_field = self.chart['x-field']
        y_fields = self.chart['y-field']
        self.y_fields = (
            y_fields,) if type(y_fields) not in (list, tuple) else y_fields

        datas = [{"values":[], 'yAxis': '1', "key": force_unicode(label_for_field(
            i, self.model, model_admin=self))} for i in self.y_fields]

        self.make_result_list()

        xdata = []

        for obj in self.result_list:
            xf, attrs, value = lookup_field(self.x_field, obj, self)
            for i, yfname in enumerate(self.y_fields):
                yf, yattrs, yv = lookup_field(yfname, obj, self)
                xtime = int(time.mktime((value.timetuple())) * 1000)
                datas[i]["values"].append({'x': xtime, 'y': yv})
                if xtime not in xdata:
                    xdata.append(xtime)

        result = json.dumps(datas, cls=JSONEncoder, ensure_ascii=False)

        return HttpResponse(result)

site.register_plugin(ChartsPlugin, ListAdminView)
site.register_modelview(r'^chart/(.+)/$', ChartsView, name='%s_%s_chart')
