import datetime
import sys
import copy
import threading

from django.conf import settings
from django.contrib import messages
from django.core.exceptions import ImproperlyConfigured
from django.core.mail import EmailMultiAlternatives
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.utils import six
if six.PY2:
    # python 2.x need to work with unicode
    from django.utils.encoding import \
        smart_unicode as smart_text, \
        force_unicode as force_text
else:
    from django.utils.encoding import force_text, smart_text
from django.utils.html import escape
from django.utils.translation import ugettext as _
from django.utils.xmlutils import SimplerXMLGenerator
from django.db.models import BooleanField, NullBooleanField

from xadmin.plugins.utils import get_context_dict
from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView
from xadmin.util import json
from xadmin.views.list import ALL_VAR

try:
    import unicodecsv
except ImportError:
    unicodecsv = None

try:
    import xlwt
    has_xlwt = True
except:
    has_xlwt = False

try:
    import xlsxwriter
    has_xlsxwriter = True
except:
    has_xlsxwriter = False


class ExportMenuPlugin(BaseAdminPlugin):

    list_export = ('xlsx', 'xls', 'csv', 'xml', 'json')
    export_names = {'xlsx': 'Excel 2007', 'xls': 'Excel', 'csv': 'CSV',
                    'xml': 'XML', 'json': 'JSON'}

    export_menu_block_template = 'xadmin/blocks/model_list.top_toolbar.exports.html'

    def init_request(self, *args, **kwargs):
        self.list_export = [
            f for f in self.list_export
            if (f != 'xlsx' or has_xlsxwriter) and (f != 'xls' or has_xlwt)]

    def block_top_toolbar(self, context, nodes):
        if self.list_export:
            context.update({
                'show_export_all': self.admin_view.paginator.count > self.admin_view.list_per_page and not ALL_VAR in self.admin_view.request.GET,
                'form_params': self.admin_view.get_form_params({'_do_': 'export'}, ('export_type',)),
                'export_types': [{'type': et, 'name': self.export_names[et]} for et in self.list_export],
            })
            nodes.append(loader.render_to_string(self.export_menu_block_template,
                                                 context=get_context_dict(context)))


class ExportPlugin(BaseAdminPlugin):

    export_mimes = {'xlsx': 'application/vnd.ms-excel',
                    'xls': 'application/vnd.ms-excel', 'csv': 'text/csv',
                    'xml': 'application/xhtml+xml', 'json': 'application/json'}

    export_unicode_csv = False
    export_unicode_encoding = "utf-8"
    export_email_config = {}

    def init_request(self, *args, **kwargs):
        return self.request.GET.get('_do_') == 'export'

    def _format_value(self, o):
        if (o.field is None and getattr(o.attr, 'boolean', False)) or \
           (o.field and isinstance(o.field, (BooleanField, NullBooleanField))):
                value = o.value
        elif str(o.text).startswith("<span class='text-muted'>"):
            value = escape(str(o.text)[25:-7])
        else:
            value = escape(str(o.text))
        return value

    def _options_is_on(self, name):
        """Checks if the option value is on. Return bool"""
        return getattr(self.request, self.request.method).get(name, 'off') == 'on'

    def _get_objects(self, context):
        headers = [c for c in context['result_headers'].cells if c.export]
        rows = context['results']

        return [dict([
            (force_text(headers[i].text), self._format_value(o)) for i, o in
            enumerate(filter(lambda c:getattr(c, 'export', False), r.cells))]) for r in rows]

    def _get_datas(self, context):
        rows = context['results']

        new_rows = [[self._format_value(o) for o in
            filter(lambda c:getattr(c, 'export', False), r.cells)] for r in rows]
        new_rows.insert(0, [force_text(c.text) for c in context['result_headers'].cells if c.export])
        return new_rows

    def get_xlsx_export(self, context):
        datas = self._get_datas(context)
        output = six.BytesIO()
        export_header = self._options_is_on('export_xlsx_header')
        model_name = self.opts.verbose_name
        book = xlsxwriter.Workbook(output)
        sheet = book.add_worksheet(
            u"%s %s" % (_(u'Sheet'), force_text(model_name)))
        styles = {'datetime': book.add_format({'num_format': 'yyyy-mm-dd hh:mm:ss'}),
                  'date': book.add_format({'num_format': 'yyyy-mm-dd'}),
                  'time': book.add_format({'num_format': 'hh:mm:ss'}),
                  'header': book.add_format({'font': 'name Times New Roman', 'color': 'red', 'bold': 'on', 'num_format': '#,##0.00'}),
                  'default': book.add_format()}

        if not export_header:
            datas = datas[1:]
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
                sheet.write(rowx, colx, value, cell_style)
        book.close()

        output.seek(0)
        return output.getvalue()

    def get_xls_export(self, context):
        datas = self._get_datas(context)
        output = six.BytesIO()
        export_header = self._options_is_on('export_xls_header')
        model_name = self.opts.verbose_name
        book = xlwt.Workbook(encoding=self.export_unicode_encoding)
        sheet = book.add_sheet(u"%s %s" % (_(u'Sheet'), force_text(model_name)))
        styles = {'datetime': xlwt.easyxf(num_format_str='yyyy-mm-dd hh:mm:ss'),
                  'date': xlwt.easyxf(num_format_str='yyyy-mm-dd'),
                  'time': xlwt.easyxf(num_format_str='hh:mm:ss'),
                  'header': xlwt.easyxf('font: name Times New Roman, color-index red, bold on', num_format_str='#,##0.00'),
                  'default': xlwt.Style.default_style}

        if not export_header:
            datas = datas[1:]
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
        if isinstance(t, bool):
            return _('Yes') if t else _('No')
        t = t.replace('"', '""').replace(',', '\,')
        cls_str = str if six.PY3 else basestring
        if isinstance(t, cls_str):
            t = '"%s"' % t
        return t

    def get_csv_export(self, context):
        if self.export_unicode_csv:
            return self.get_unicode_csv_export(context)

        datas = self._get_datas(context)
        stream = []

        if self._options_is_on('export_csv_header'):
            datas = datas[1:]

        for row in datas:
            stream.append(','.join(map(self._format_csv_text, row)))

        return '\r\n'.join(stream)

    def get_unicode_csv_export(self, context):
        """Exports the data in the configured encoding. Default utf8"""
        if unicodecsv is None:
            raise ImproperlyConfigured("Need to install module \"unicodecsv\" "
                                       "in order to export csv as unicode.")
        datas = self._get_datas(context)
        stream = six.BytesIO()
        writer = unicodecsv.writer(stream, encoding=self.export_unicode_encoding)
        writer.writerows(datas)
        return stream.getvalue()

    def _to_xml(self, xml, data):
        if isinstance(data, (list, tuple)):
            for item in data:
                xml.startElement("row", {})
                self._to_xml(xml, item)
                xml.endElement("row")
        elif isinstance(data, dict):
            for key, value in six.iteritems(data):
                key = key.replace(' ', '_')
                xml.startElement(key, {})
                self._to_xml(xml, value)
                xml.endElement(key)
        else:
            xml.characters(smart_text(data))

    def get_xml_export(self, context):
        results = self._get_objects(context)

        stream = six.BytesIO()

        xml = SimplerXMLGenerator(stream, self.export_unicode_encoding)
        xml.startDocument()
        xml.startElement("objects", {})

        self._to_xml(xml, results)

        xml.endElement("objects")
        xml.endDocument()

        return stream.getvalue().split((b'\n'))[1]

    def get_json_export(self, context):
        results = self._get_objects(context)
        return json.dumps({'objects': results}, ensure_ascii=False,
                          indent=(self._options_is_on('export_json_format') and 4 or None))

    def send_mail(self, user, data, context):
        """Send the data file by email"""
        filename, content, file_mimetype = self._get_file_spec(data, context)
        export_email_config = {
            'subject': _('Exported file delivery'),
            'message': _('The file is attached.'),
            'from_email': settings.DEFAULT_FROM_EMAIL,
            'recipient_list': [user.email],
            'fail_silently': True,
            'html_message': False
        }
        export_email_config.update(self.export_email_config)

        html_message = export_email_config.pop('html_message', False)
        fail_silently = export_email_config.pop('fail_silently', True)

        # compat
        export_email_config['body'] = export_email_config.pop('message', '')
        export_email_config['to'] = export_email_config.pop('recipient_list', None)

        mail = EmailMultiAlternatives(**export_email_config)
        if html_message:
            mail.attach_alternative(html_message, 'text/html')

        mail.attach(filename, content, file_mimetype)
        mail.send(fail_silently=fail_silently)
        return True

    def _get_file_spec(self, data, context):
        file_type = data.get('export_type', 'csv')
        content = getattr(self, 'get_%s_export' % file_type)(context)
        filename = u"{0:s}.{1:s}".format(self.opts.verbose_name.replace(' ', '_'),
                                         file_type)
        file_mimetype = self.export_mimes[file_type]
        return filename, content, file_mimetype

    def get_response(self, response, context, *args, **kwargs):
        if self._options_is_on('export_to_email'):
            user = self.request.user
            email = user.email if hasattr(user, 'email') else None
            if email is not None:
                th = threading.Thread(target=self.send_mail,
                                      args=(self.request.user,
                                            copy.deepcopy(self.request.GET),
                                            context.copy()))
                th.start()
                messages.success(self.request, _("The file is sent to your email: "
                                                 "<strong>{0:s}</strong>".format(email)))
            else:
                messages.warning(self.request, _("Your account does not have an email address."))
            return HttpResponseRedirect(self.request.path)

        filename, content, file_mimetype = self._get_file_spec(self.request.GET, context)

        response = HttpResponse(content_type="{0:s}; charset={1:s}".format(file_mimetype, self.export_unicode_encoding))
        filename_format = u'attachment; filename="{0:s}"'.format(filename)
        response['Content-Disposition'] = filename_format.encode(self.export_unicode_encoding)

        response.write(content)
        return response

    # View Methods
    def get_result_list(self, __):
        if self._options_is_on('all'):
            self.admin_view.list_per_page = sys.maxsize
        return __()

    def result_header(self, item, field_name, row):
        item.export = not item.attr or field_name == '__str__' or getattr(item.attr, 'allow_export', True)
        return item

    def result_item(self, item, obj, field_name, row):
        item.export = item.field or field_name == '__str__' or getattr(item.attr, 'allow_export', True)
        return item


site.register_plugin(ExportMenuPlugin, ListAdminView)
site.register_plugin(ExportPlugin, ListAdminView)
