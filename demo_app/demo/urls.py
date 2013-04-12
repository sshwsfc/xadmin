from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
import xadmin
xadmin.autodiscover()

from xadmin.plugins import xversion
xversion.registe_models()

urlpatterns = patterns('',
    url(r'', include(xadmin.site.urls)),
)
