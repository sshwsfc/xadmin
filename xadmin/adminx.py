import xadmin
from xadmin import views
from models import UserSettings
from xadmin.layout import *


class UserSettingsAdmin(object):
    model_icon = 'cog'
xadmin.site.register(UserSettings, UserSettingsAdmin)
