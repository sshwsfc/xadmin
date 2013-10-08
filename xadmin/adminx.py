import xadmin
from models import UserSettings
from xadmin.layout import *


class UserSettingsAdmin(object):
    model_icon = 'cog'
    hidden_menu = True
xadmin.site.register(UserSettings, UserSettingsAdmin)
