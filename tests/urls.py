from django.conf.urls import patterns, include

urlpatterns = patterns('',
    (r'^view_base/', include('view_base.urls')),
)