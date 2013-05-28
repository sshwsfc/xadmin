import StringIO
import datetime

from django.http import HttpResponse
from django.template import loader
from django.utils.encoding import force_unicode, smart_unicode
from django.utils.html import escape
from django.utils.translation import ugettext as _
from django.utils.xmlutils import SimplerXMLGenerator
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView
from xadmin.util import json

try:
    import xlwt
    has_xlwt = True
except:
    has_xlwt = False


class ExportPlugin(BaseAdminPlugin):

    list_export = ('xls', 'csv', 'xml', 'json')
    export_mimes = {'xls': 'application/vnd.ms-excel', 'csv': 'text/csv',
                    'xml': 'application/xhtml+xml', 'json': 'application/json'}
    export_names = {'xls': 'Excel', 'csv': 'CSV', 'xml': 'XML', 'json': 'JSON'}

    def init_request(self, *args, **kwargs):
        self.list_export = [
            f for f in self.list_export if f != 'xls' or has_xlwt]

    def get_results(self, context):
        headers = [c for c in context['result_headers'].cells if c.export]
        if self.request.GET.get('all', 'off') == 'on':
            from xadmin.plugins.filters import FilterPlugin
            for plugin in self.admin_view.plugins:
                if isinstance(plugin, FilterPlugin):
                    queryset = plugin.get_list_queryset(self.admin_view.queryset())
                    break
            else:
                queryset = self.admin_view.queryset()
            rows = [self.admin_view.result_row(obj) for obj in queryset]
        else:
            rows = context['results']

        return [dict([(force_unicode(headers[i].text), escape(str(o.value))) for i, o in
                      enumerate(filter(lambda c:getattr(c, 'export', False), r.cells))])
                for r in rows]

    def get_xls_export(self, context):
        results = self.get_results(context)
        output = StringIO.StringIO()
        export_header = (
            self.request.GET.get('export_xls_header', 'off') == 'on')

        model_name = self.opts.verbose_name
        book = xlwt.Workbook(encoding='utf8')
        sheet = book.add_sheet(
            u"%s %s" % (_(u'Sheet'), force_unicode(model_name)))
        styles = {'datetime': xlwt.easyxf(num_format_str='yyyy-mm-dd hh:mm:ss'),
                  'date': xlwt.easyxf(num_format_str='yyyy-mm-dd'),
                  'time': xlwt.easyxf(num_format_str='hh:mm:ss'),
                  'header': xlwt.easyxf('font: name Times New Roman, color-index red, bold on', num_format_str='#,##0.00'),
                  'default': xlwt.Style.default_style}

        datas = [row.values() for row in results]
        if export_header:
            datas.insert(0, results[0].keys())
        for rowx, row in enumerate(datas):
            for colx, value in enumerate(row):
                if export_header and rowx == 0:
                    cell_style = styles['header']
                else:
                    if isinstance(value, datetime.datetime):
                        cell_style = styles['datetime']
                    elif isinstance(value, datetime.date):
                        cell_style = styles['date']
                    elif isinstance(value, datetime.time):
                        cell_style = styles['time']
                    else:
                        cell_style = styles['default']
                sheet.write(rowx, colx, value, style=cell_style)
        book.save(output)

        output.seek(0)
        return output.getvalue()

    def _format_csv_text(self, t):
        t = t.replace('"', '""').replace(',', '\,')
        if isinstance(t, basestring):
            t = '"%s"' % t
        return t

    def get_csv_export(self, context):
        results = self.get_results(context)
        stream = []

        if self.request.GET.get('export_csv_header', 'off') == 'on':
            stream.append(
                ','.join(map(self._format_csv_text, results[0].keys())))

        for row in results:
            stream.append(','.join(map(self._format_csv_text, row.values())))

        return '\r\n'.join(stream)

    def _to_xml(self, xml, data):
        if isinstance(data, (list, tuple)):
            for item in data:
                xml.startElement("row", {})
                self._to_xml(xml, item)
                xml.endElement("row")
        elif isinstance(data, dict):
            for key, value in data.iteritems():
                xml.startElement(key, {})
                self._to_xml(xml, value)
                xml.endElement(key)
        else:
            xml.characters(smart_unicode(data))

    def get_xml_export(self, context):
        results = self.get_results(context)
        stream = StringIO.StringIO()

        xml = SimplerXMLGenerator(stream, "utf-8")
        xml.startDocument()
        xml.startElement("objects", {})

        self._to_xml(xml, results)

        xml.endElement("objects")
        xml.endDocument()

        return stream.getvalue().split('\n')[1]

    def get_json_export(self, context):
        results = self.get_results(context)
        return json.dumps({'objects': results}, ensure_ascii=False,
                          indent=(self.request.GET.get('export_json_format', 'off') == 'on') and 4 or None)

    def get_response(self, response, context, *args, **kwargs):
        if self.request.GET.get('_do_') != 'export':
            return response

        file_type = self.request.GET.get('export_type', 'csv')
        response = HttpResponse(
            mimetype="%s; charset=UTF-8" % self.export_mimes[file_type])

        file_name = self.opts.verbose_name.replace(' ', '_')
        response['Content-Disposition'] = ('attachment; filename=%s.%s' % (
            file_name, file_type)).encode('utf-8')

        response.write(getattr(self, 'get_%s_export' % file_type)(context))
        return response

    # View Methods
    def result_header(self, item, field_name, row):
        if self.request.GET.get('_do_') == 'export':
            item.export = True
            if item.attr and field_name != '__str__' and not getattr(item.attr, 'allow_export', False):
                item.export = False
        return item

    def result_item(self, item, obj, field_name, row):
        if self.request.GET.get('_do_') == 'export':
            item.export = True
            if item.field is None and field_name != '__str__' and not getattr(item.attr, 'allow_export', False):
                item.export = False
        return item

    def block_top_toolbar(self, context, nodes):
        if self.list_export:
            context.update({
                'form_params': self.admin_view.get_form_params({'_do_': 'export'}, ('export_type',)),
                'export_types': [{'type': et, 'name': self.export_names[et]} for et in self.list_export],
            })
            nodes.append(loader.render_to_string('xadmin/blocks/model_list.top_toolbar.exports.html', context_instance=context))


site.register_plugin(ExportPlugin, ListAdminView)
