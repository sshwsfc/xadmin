from django.test import TestCase as DjangoTestCase
from django.test.client import Client
from django.test.client import RequestFactory

from django.contrib.auth.models import User

from xadmin.tests.models import ModelA
from xadmin.sites import site

class ExRequestFactory(RequestFactory):

    def request(self, **request):
        request = super(ExRequestFactory, self).request(**request)
        request.user = User.objects.get(username="admin")
        return request

class TestCase(DjangoTestCase):

    def setUp(self):
        User.objects.create_superuser('admin', 'admin@testdomain.com', 'admin')

        self.admin_site = site

    def get_client(self, login=True):
        c = Client()
        if login:
            c.login(username='admin', password='admin')
        return c

    def get_factory(self):
        return ExRequestFactory()

    def get_view_class(self, view_class, model=None, **opts):
        admin_class = self.admin_site._registry.get(model) if model else None
        return self.admin_site.get_view_class(view_class, admin_class, **opts)

    def get_admin_view(self, view_class, model=None, request=None, **opts):
        admin_class = self.get_view_class(view_class, model, **opts)
        if request is None:
            request = self.get_factory().get('/')
        return admin_class(request)