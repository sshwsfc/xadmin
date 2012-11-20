
import datetime, decimal, calendar

from django.contrib.admin.templatetags.admin_static import static
from django.template import loader
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseNotFound
from django.core.serializers.json import DjangoJSONEncoder
from django.http import HttpResponse
from django.utils import simplejson
from django.utils.encoding import smart_unicode

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView
from exadmin.util import lookup_field, label_for_field

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

class ChartsPlugin(BaseAdminPlugin):

    data_charts = {}

    def get_chart_url(self, name, v):
        return self.admin_view.model_admin_urlname('chart', name) + self.admin_view.get_query_string()

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
            context.update({
                'charts': [{"name": name, "title": v['title'], 'url': self.get_chart_url(name, v)} for name,v in self.data_charts.items()],
            })
            nodes.append(loader.render_to_string('admin/blocks/charts.html', context_instance=context))

class ChartsView(ListAdminView):

    data_charts = {}

    def init_request(self, name):
        if not self.data_charts.has_key(name):
            return HttpResponseNotFound()

        self.chart = self.data_charts[name]

        self.x_field = self.chart['x-field']
        y_fields = self.chart['y-field']
        self.y_fields = (y_fields,) if type(y_fields) not in (list, tuple) else y_fields

        return super(ChartsView, self).init_request(name)

    def get_ordering(self):
        if self.chart.has_key('order'):
            return self.chart['order']
        else:
            return super(ChartsView, self).get_ordering()

    def get(self, request, name):
        if not self.has_change_permission():
            raise PermissionDenied

        datas = [{"data":[], "label": label_for_field(i, self.model, model_admin=self)} for i in self.y_fields]

        for obj in self.result_list:
            xf, attrs, value = lookup_field(self.x_field, obj, self)
            for i, yfname in enumerate(self.y_fields):
                yf, yattrs, yv = lookup_field(yfname, obj, self)
                datas[i]["data"].append((value, yv))

        option = {'series': {'lines': { 'show': True }, 'points': { 'show': False }},
                'xaxis': { 'mode': "time", 'tickLength': 5 , 'timeformat': "%y/%m/%d"},
                'grid': { 'hoverable': True, 'clickable': True }}
        option.update(self.chart.get('option', {}))

        content = {'data': datas, 'option': option}
        json = simplejson.dumps(content, cls=JSONEncoder, ensure_ascii=False)

        return HttpResponse(json)

site.register_plugin(ChartsPlugin, ListAdminView)
site.register_modelview(r'^chart/(.+)/$', ChartsView, name='%s_%s_chart')


