from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
import exadmin
exadmin.autodiscover()

from exadmin.plugins import xversion
xversion.registe_models()

urlpatterns = patterns('',
    url(r'', include(exadmin.site.urls)),
)
