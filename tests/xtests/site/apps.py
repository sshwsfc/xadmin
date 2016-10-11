#!/usr/bin/env python
#coding:utf-8
import sys
if sys.version_info.major < 3 and sys.getdefaultencoding()=='ascii':
    import imp
    imp.reload(sys)
    sys.setdefaultencoding('utf-8')

from django.apps import AppConfig

class SiteApp(AppConfig):
    name = "site"
