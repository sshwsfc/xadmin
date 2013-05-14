from django.test import TestCase
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.test.client import RequestFactory

from xadmin.sites import AdminSite
from xadmin.views import BaseAdminView, BaseAdminPlugin, ModelAdminView, filter_hook

from models import ModelA


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


class AdminSiteTest(TestCase):

    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()

    def _create_superuser(self, username):
        return User.objects.create(username=username, is_superuser=True)

    def _mocked_authenticated_request(self, url, user):
        request = self.factory.get(url)
        request.user = user
        return request

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

        admin = self._create_superuser('admin')
        cv = c(self._mocked_authenticated_request('test/', admin))

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
