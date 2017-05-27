from __future__ import absolute_import
from django.conf.urls import patterns, include
from .adminx import site

urlpatterns = patterns('',
    (r'', include(site.urls)),
)