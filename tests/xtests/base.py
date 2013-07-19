from django.test import TestCase
from django.contrib.auth.models import User
from django.test.client import RequestFactory

class BaseTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    def _create_superuser(self, username):
        return User.objects.create(username=username, is_superuser=True)

    def _mocked_request(self, url, user='admin'):
        request = self.factory.get(url)
        request.user = isinstance(user, User) and user or self._create_superuser(user)
        request.session = {}
        return request