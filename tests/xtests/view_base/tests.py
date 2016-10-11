from __future__ import absolute_import

from django.contrib.auth.models import User

from base import BaseTest
from xadmin.views import BaseAdminView, BaseAdminPlugin, ModelAdminView, ListAdminView

from .models import ModelA, ModelB
from .adminx import site, ModelAAdmin, TestBaseView, TestCommView, TestAView, OptionA

class BaseAdminTest(BaseTest):

    def setUp(self):
        super(BaseAdminTest, self).setUp()
        self.test_view_class = site.get_view_class(TestBaseView)
        self.test_view = self.test_view_class(self._mocked_request('test/'))

    def test_get_view(self):
        test_a = self.test_view.get_view(TestAView, OptionA, opts={'test_attr': 'test'})

        self.assertTrue(isinstance(test_a, TestAView))
        self.assertTrue(isinstance(test_a, OptionA))

        self.assertEqual(test_a.option_attr, 'option_test')
        self.assertEqual(test_a.test_attr, 'test')

    def test_model_view(self):
        test_model = self.test_view.get_model_view(ListAdminView, ModelA)

        self.assertTrue(isinstance(test_model, ModelAAdmin))
        self.assertEqual(test_model.model, ModelA)
        self.assertEqual(test_model.test_model_attr, 'test_model')

    def test_admin_url(self):
        test_url = self.test_view.get_admin_url('test')
        self.assertEqual(test_url, '/view_base/test/base')

    def test_model_url(self):
        test_url = self.test_view.get_model_url(ModelA, 'list')
        self.assertEqual(test_url, '/view_base/view_base/modela/list')

    def test_has_model_perm(self):
        test_user = User.objects.create(username='test_user')

        self.assertFalse(self.test_view.has_model_perm(ModelA, 'change', test_user))

        # Admin User
        self.assertTrue(self.test_view.has_model_perm(ModelA, 'change'))


class CommAdminTest(BaseTest):

    def setUp(self):
        super(CommAdminTest, self).setUp()
        self.test_view_class = site.get_view_class(TestCommView)
        self.test_view = self.test_view_class(self._mocked_request('test/comm'))

    def test_model_icon(self):  
        self.assertEqual(self.test_view.get_model_icon(ModelA), 'flag')
        self.assertEqual(self.test_view.get_model_icon(ModelB), 'test')
