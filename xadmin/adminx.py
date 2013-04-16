import xadmin
from xadmin import views
from models import UserSettings
from xadmin.layout import *

class UserSettingsAdmin(object):
    pass
xadmin.site.register(UserSettings, UserSettingsAdmin)

