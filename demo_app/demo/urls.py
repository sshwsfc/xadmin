# -*- coding: utf-8 -*-
from django.conf.urls import include, url

# Uncomment the next two lines to enable the admin:
import xadmin
xadmin.autodiscover()

# version模块自动注册需要版本控制的 Model
from xadmin.plugins import xversion
xversion.register_models()

from django.contrib import admin

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include(xadmin.site.urls))
]
