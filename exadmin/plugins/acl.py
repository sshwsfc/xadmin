from django.http import HttpResponse
from django.utils import simplejson
from django.utils.html import escape
from django import forms
from django.conf import settings
from django.utils.html import conditional_escape
from django.utils.encoding import StrAndUnicode, force_unicode
from django.utils.safestring import mark_safe
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, ModelFormAdminView

class UserFieldPlugin(BaseAdminPlugin):

    user_fields = []

    def get_field_attrs(self, __, db_field, **kwargs):
        if self.user_fields and db_field.name in self.user_fields:
            return {'widget': forms.HiddenInput}
        return __()

    def get_form_datas(self, datas):
        if self.user_fields and datas.has_key('data'):
            for f in self.user_fields:
                datas['data'][f] = self.user.id
        return datas

site.register_plugin(UserFieldPlugin, ModelFormAdminView)