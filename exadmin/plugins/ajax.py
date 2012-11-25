from django.http import HttpResponse
from django.utils import simplejson
from django.utils.html import escape
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView

class AjaxListPlugin(BaseAdminPlugin):

    def get_result_list(self, response):
        if not (self.request.is_ajax() or self.request.GET.get('_ajax')):
            return response

        response = HttpResponse(mimetype="application/json; charset=UTF-8")

        av = self.admin_view
        base_fields = av.base_list_display
        headers = dict([(c.field_name, c.text) for c in av.result_headers().cells if c.field_name in base_fields])

        objects = [dict([(o.field_name, escape(str(o.value))) for i,o in \
            enumerate(filter(lambda c:c.field_name in base_fields, r.cells))]) \
            for r in av.results()]

        content = simplejson.dumps({'headers': headers, 'objects': objects}, ensure_ascii=False, indent=4)
        response.write(content)

        return response

site.register_plugin(AjaxListPlugin, ListAdminView)


