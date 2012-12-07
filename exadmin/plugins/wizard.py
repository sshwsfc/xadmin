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
from exadmin.views import BaseAdminPlugin, ModelFormAdminView

class WizardFormPlugin(BaseAdminPlugin):

    pass

site.register_plugin(WizardFormPlugin, ModelFormAdminView)