from django.conf.urls import patterns, include, url
from django.contrib import admin
import xadmin
xadmin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'xadmin/', include(xadmin.site.urls, app_name='xadmin')),
)
