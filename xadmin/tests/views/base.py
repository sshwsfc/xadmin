from xadmin.tests.base import TestCase

from xadmin.views.base import BaseAdminView

class BaseViewTest(TestCase):

    admin_test_view = BaseAdminView

    def get_test_view(self):
        return self.get_admin_view(self.admin_test_view)

    def testView(self):
        c = self.get_client()
        response = c.get('/')
        self.assertTemplateUsed(response, 'xadmin/dashboard.html')

    def testBaseContext(self):
        context = self.get_test_view().get_context()

        self.assertIn("admin_view", context.keys())
        self.assertIn("media", context.keys())
