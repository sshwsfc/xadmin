from xadmin.sites import site

from base import BaseAdminPlugin, BaseAdminView, CommAdminView, ModelAdminView, filter_hook, BaseAdminObject

from list import ListAdminView
from edit import CreateAdminView, UpdateAdminView, ModelFormAdminView
from delete import DeleteAdminView
from detail import DetailAdminView
from dashboard import Dashboard, BaseWidget, widget_manager, ModelDashboard
from website import IndexView, LoginView, LogoutView, UserSettingView

__all__ = (
    'BaseAdminObject',
    'BaseAdminPlugin', 'BaseAdminView', 'CommAdminView', 'ModelAdminView', 'ListAdminView',
    'ModelFormAdminView', 'CreateAdminView', 'UpdateAdminView', 'DeleteAdminView', 'DetailAdminView',
    'Dashboard', 'BaseWidget',
    'IndexView', 'LoginView', 'LogoutView'
)

# admin site-wide views
site.register_view(r'^$', IndexView, name='index')
site.register_view(r'^login/$', LoginView, name='login')
site.register_view(r'^logout/$', LogoutView, name='logout')

site.register_view(r'^settings/user$', UserSettingView, name='user_settings')

site.register_modelview(r'^$', ListAdminView, name='%s_%s_changelist')
site.register_modelview(r'^add/$', CreateAdminView, name='%s_%s_add')
site.register_modelview(
    r'^(.+)/delete/$', DeleteAdminView, name='%s_%s_delete')
site.register_modelview(
    r'^(.+)/update/$', UpdateAdminView, name='%s_%s_change')
site.register_modelview(
    r'^(.+)/detail/$', DetailAdminView, name='%s_%s_detail')
site.register_modelview(
    r'^(.+)/dashboard/$', ModelDashboard, name='%s_%s_dashboard')
