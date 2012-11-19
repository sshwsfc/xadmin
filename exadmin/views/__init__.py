from exadmin.sites import site

from base import BaseAdminPlugin, BaseAdminView, ModelAdminView

from list import ListAdminView
from edit import CreateAdminView, UpdateAdminView
from delete import DeleteAdminView
from dataapi import get_urls as dataapi_get_urls, api_manager
from website import IndexView, LoginView

# admin site-wide views
site.register_view(r'^$', IndexView, name='index')
site.register_view(r'^login/$', LoginView, name='login')

site.register_view(r'^api/', dataapi_get_urls, name='data_api')

site.register_modelview(r'^$', ListAdminView, name='%s_%s_changelist')
site.register_modelview(r'^add/$', CreateAdminView, name='%s_%s_add')
site.register_modelview(r'^(.+)/delete/$', DeleteAdminView, name='%s_%s_delete')
site.register_modelview(r'^(.+)/update/$', UpdateAdminView, name='%s_%s_change')
