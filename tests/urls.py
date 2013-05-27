from django.conf.urls import patterns, include

urlpatterns = patterns('',
    (r'^view_base/', include('xtests.view_base.urls')),
)