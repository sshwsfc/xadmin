
from django.db import models
from django import forms
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView

class RelateFieldPlugin(BaseAdminPlugin):

    def get_field_style(self, attrs, db_field, style):
        # search able fk field
        if style == 'fk-ajax' and isinstance(db_field, models.ForeignKey):
            to_opts = db_field.rel.to._meta
            datas = {
                'class': 'select-search',
                'data-search-url': self.admin_view.admin_urlname('%s_%s_changelist' % (to_opts.app_label, to_opts.module_name))
            }
            return dict(attrs or {}, widget=forms.TextInput(attrs=datas))

site.register_plugin(RelateFieldPlugin, ModelFormAdminView)


