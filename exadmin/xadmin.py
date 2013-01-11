import exadmin
from exadmin import views
from models import UserSettings
from exadmin.layout import *

class UserSettingsAdmin(object):
    pass
exadmin.site.register(UserSettings, UserSettingsAdmin)

