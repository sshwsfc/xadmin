from django.urls import path, include

urlpatterns = [
    path(r'view_base/', include('view_base.urls')),
]
