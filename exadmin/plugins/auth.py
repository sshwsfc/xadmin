from django.contrib.auth.models import User, Group
from django.utils.decorators import method_decorator
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.forms import (UserCreationForm, UserChangeForm,
    AdminPasswordChangeForm)
from django.views.decorators.csrf import csrf_protect
from exadmin.sites import site
from exadmin.layout import *

csrf_protect_m = method_decorator(csrf_protect)

class GroupAdmin(object):
    search_fields = ('name',)
    ordering = ('name',)

class UserAdmin(object):
    change_user_password_template = None
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)
    style_fields = {'user_permissions': 'm2m_transfer'}

    def get_model_form(self, **kwargs):
        if self.org_obj is None:
            self.form = UserCreationForm
        else:
            self.form = UserChangeForm
        return super(UserAdmin, self).get_model_form(**kwargs)

    def get_form_layout(self):
        if self.org_obj:
            self.form_layout = (
                Main(
                    Fieldset('',
                        'username', 'password',
                        css_class='unsort no_title'
                    ),
                    Fieldset(_('Personal info'),
                        Row('first_name', 'last_name'),
                        Row(AppendedText('hard_disk', 'G'), AppendedText('memory', "G")),
                        'email'
                    ),
                    Fieldset(_('Permissions'),
                        'groups', 'user_permissions'
                    ),
                    Fieldset(_('Important dates'),
                        'last_login', 'date_joined'
                    ),
                ),
                Side(
                    Fieldset(_('Status'),
                        'is_active', 'is_staff', 'is_superuser',
                    ),
                )
            )
        return super(UserAdmin, self).get_form_layout()

site.register(Group, GroupAdmin)
site.register(User, UserAdmin)

