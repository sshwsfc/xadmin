from __future__ import absolute_import

from django.urls import path

from .adminx import site

urlpatterns = [
    path(r'', site.urls),
]
