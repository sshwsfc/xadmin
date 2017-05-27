from __future__ import absolute_import
from django.http import HttpResponse

from base import BaseTest
from xadmin.sites import AdminSite
from xadmin.views import BaseAdminView, BaseAdminPlugin, ModelAdminView, filter_hook

from .models import ModelA


class ModelAAdmin(object):
    pass


class TestAdminView(BaseAdminView):
    site_title = "TEST TITLE"

    @filter_hook
    def get_title(self):
        return self.site_title

    def get(self, request):
        return HttpResponse(self.site_title)


class TestOption(object):
    site_title = "TEST PROJECT"


class TestPlugin(BaseAdminPlugin):

    def get_title(self, title):
        return "%s PLUGIN" % title


class TestModelAdminView(ModelAdminView):

    def get(self, request, obj_id):
        return HttpResponse(str(obj_id))


class AdminSiteTest(BaseTest):

    def get_site(self):
        return AdminSite('test', 'test_app')

    def test_register_model(self):
        site = self.get_site()

        site.register(ModelA, ModelAAdmin)

        self.assertIn(ModelA, site._registry.keys())

    def test_unregister_model(self):
        site = self.get_site()

        site.register(ModelA, ModelAAdmin)
        site.unregister(ModelA)

        self.assertNotIn(ModelA, site._registry.keys())

    def test_viewoption(self):
        site = self.get_site()

        site.register_view(r"^test/$", TestAdminView, 'test')
        site.register(TestAdminView, TestOption)

        c = site.get_view_class(TestAdminView)
        self.assertEqual(c.site_title, "TEST PROJECT")

    def test_plugin(self):
        site = self.get_site()

        site.register_view(r"^test/$", TestAdminView, 'test')
        site.register_plugin(TestPlugin, TestAdminView)

        c = site.get_view_class(TestAdminView)
        self.assertIn(TestPlugin, c.plugin_classes)

        cv = c(self._mocked_request('test/'))

        self.assertEqual(cv.get_title(), "TEST TITLE PLUGIN")

    def test_get_urls(self):
        site = self.get_site()

        site.register(ModelA, ModelAAdmin)
        site.register_view(r"^test/$", TestAdminView, 'test')
        site.register_modelview(
            r'^(.+)/test/$', TestModelAdminView, name='%s_%s_test')

        urls, app_name, namespace = site.urls

        self.assertEqual(app_name, 'test_app')
        self.assertEqual(namespace, 'test')
