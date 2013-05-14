from xadmin.tests.base import TestCase


class DeleteTest(TestCase):

    def test_delete(self):
        c = self.get_client()
        response = c.get('/')
