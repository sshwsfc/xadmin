from django.conf.urls import patterns, include
from .adminx import site

urlpatterns = patterns('',
    (r'', include(site.urls)),
)