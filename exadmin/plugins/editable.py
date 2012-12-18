

from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.db import models
from django.template import loader
from django.utils import simplejson

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, api_manager
from exadmin.util import label_for_field

class EditablePlugin(BaseAdminPlugin):

    editable_fields = []

    def __init__(self, admin_view):
        super(EditablePlugin, self).__init__(admin_view)
        self.editable_need_fields = {}

    def get_details_url(self, obj):
        resuorce = api_manager.get_resource(obj)
        if resuorce:
            return resuorce.get_resource_uri(obj)
        return None

    def result_item(self, item, obj, field_name, row):
        if self.editable_fields and item.field and item.field.editable and (field_name in self.editable_fields):
            val = item.field.value_to_string(obj)
            field_label = label_for_field(field_name, obj,
                model_admin = self.admin_view,
                return_attr = False
            )
            data_attr = {
                'pk': str(getattr(obj, obj._meta.pk.attname)),
                'name': field_name,
                'value': val,
                'original-title': _(u"Enter %s") % field_label,
                'url': self.get_details_url(obj)
            }
            item.wraps.insert(0, '<span class="editable-field">%s</span>')
            item.btns.append('<a class="editable-handler" %s rel="tooltip" title="%s"><i class="icon-edit"></i></a>' \
                % (' '.join(['data-%s="%s"' % (k,v) for k,v in data_attr.items()]), _(u'Edit %s' % item.field.verbose_name)))
            if not self.editable_need_fields.has_key(field_name):
                self.editable_need_fields[field_name] = item.field
        return item

    def get_field_settings(self, name, field):
        settings = {}
        if field.choices:
            settings['type'] = 'select'
            settings['source'] = dict(field.get_choices(
                    include_blank = field.blank,
                    blank_choice=[('', _('None'))]
                ))
        elif isinstance(field, (models.DateField, models.DateTimeField)):
            settings['type'] = 'date'
        elif isinstance(field, (models.ForeignKey, models.ManyToManyField)):
            settings['type'] = 'select'
        elif isinstance(field, models.TextField):
            settings['type'] = 'textarea'
        elif isinstance(field, models.IntegerField):
            settings['type'] = 'text'
            settings['inputclass'] = 'input-mini'
        else:
            settings['type'] = 'text'
        return settings

    # Media
    def get_media(self, media):
        if self.editable_need_fields:
            media.add_css({'screen': [self.static('exadmin/css/bootstrap-editable.css')]})
            media.add_js([self.static('exadmin/js/editable.js')])
        return media

    # Js Block
    def block_extrabody(self, context, nodes):
        if self.editable_need_fields:
            data = {}
            for name, field in self.editable_need_fields.items():
                data[name] = self.get_field_settings(name, field)
            context.update({"fields_settings": simplejson.dumps(data, ensure_ascii=False)})
            nodes.append(loader.render_to_string('admin/blocks/editable.js.html', context_instance=context))

site.register_plugin(EditablePlugin, ListAdminView)


