from xadmin.views.base import BaseAdminPlugin
from xadmin.views.edit import ModelFormAdminView
import xadmin
from django import forms
from django.db.models.fields import TextField
from xadmin.util import vendor
from django.utils.html import format_html
from django.forms.utils import flatatt
from django.utils.encoding import force_text
from django.template import loader

class BootstrapWYSIHTML5Editor(forms.Textarea):
    
    @property
    def media(self):
        return vendor('bootstrap-wysihtml5.js','bootstrap-wysihtml5.css','xadmin.widget.bootstrap-wysihtml5.js')


class BootstrapWYSIWYGEditor(forms.Textarea):
    template = 'xadmin/widgets/wysiwyg.html'
    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        final_attrs = self.build_attrs(attrs, name=name)
        self.name = name
        self.value = value
        self.final_attrs = flatatt(final_attrs)
        context = {'self':self}
        return loader.render_to_string(self.template, context)

    @property
    def media(self):
        return vendor('bootstrap-wysiwyg.js','bootstrap-wysiwyg.css','xadmin.widget.bootstrap-wysiwyg.js')


class WYSIWYGEditorPlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        return hasattr(self.admin_view, 'style_fields') and \
            (
                'bootstrap_wysihtml5' in self.admin_view.style_fields.values() or
                'bootstrap_wysiwyg' in self.admin_view.style_fields.values()
            )

    def get_field_style(self, attrs, db_field, style, **kwargs):
        if style == 'bootstrap_wysihtml5' and isinstance(db_field, TextField):
            return {'widget': BootstrapWYSIHTML5Editor}
        if style == 'bootstrap_wysiwyg' and isinstance(db_field, TextField):
            return {'widget': BootstrapWYSIWYGEditor}
        return attrs


xadmin.site.register_plugin(WYSIWYGEditorPlugin, ModelFormAdminView)