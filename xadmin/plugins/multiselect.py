#coding:utf-8
from itertools import chain

import xadmin
from django import forms
from django.contrib.admin.templatetags.admin_static import static
from django.db.models import ManyToManyField
from django.core.urlresolvers import reverse
from django.forms.utils import flatatt
from django.template import loader
from django.utils.encoding import force_unicode
from django.utils.html import escape, conditional_escape
from django.utils.safestring import mark_safe
from django.utils.text import Truncator
from django.utils.translation import ugettext as _
from django.contrib.admin.widgets import url_params_from_lookup_dict

from xadmin.util import vendor
from xadmin.views import BaseAdminPlugin, ModelFormAdminView


class SelectMultipleTransfer(forms.SelectMultiple):

    @property
    def media(self):
        return vendor('xadmin.widget.select-transfer.js', 'xadmin.widget.select-transfer.css')

    def __init__(self, verbose_name, is_stacked, attrs=None, choices=()):
        self.verbose_name = verbose_name
        self.is_stacked = is_stacked
        super(SelectMultipleTransfer, self).__init__(attrs, choices)

    def render_opt(self, selected_choices, option_value, option_label):
        option_value = force_unicode(option_value)
        return u'<option value="%s">%s</option>' % (
            escape(option_value), conditional_escape(force_unicode(option_label))), bool(option_value in selected_choices)

    def render(self, name, value, attrs=None, choices=()):
        if attrs is None:
            attrs = {}
        attrs['class'] = ''
        if self.is_stacked:
            attrs['class'] += 'stacked'
        if value is None:
            value = []
        final_attrs = self.build_attrs(attrs, name=name)

        selected_choices = set(force_unicode(v) for v in value)
        available_output = []
        chosen_output = []

        for option_value, option_label in chain(self.choices, choices):
            if isinstance(option_label, (list, tuple)):
                available_output.append(u'<optgroup label="%s">' %
                                        escape(force_unicode(option_value)))
                for option in option_label:
                    output, selected = self.render_opt(
                        selected_choices, *option)
                    if selected:
                        chosen_output.append(output)
                    else:
                        available_output.append(output)
                available_output.append(u'</optgroup>')
            else:
                output, selected = self.render_opt(
                    selected_choices, option_value, option_label)
                if selected:
                    chosen_output.append(output)
                else:
                    available_output.append(output)

        context = {
            'verbose_name': self.verbose_name,
            'attrs': attrs,
            'field_id': attrs['id'],
            'flatatts': flatatt(final_attrs),
            'available_options': u'\n'.join(available_output),
            'chosen_options': u'\n'.join(chosen_output),
        }
        return mark_safe(loader.render_to_string('xadmin/forms/transfer.html', context))


class SelectMultipleDropdown(forms.SelectMultiple):

    @property
    def media(self):
        return vendor('multiselect.js', 'multiselect.css', 'xadmin.widget.multiselect.js')

    def render(self, name, value, attrs=None, choices=()):
        if attrs is None:
            attrs = {}
        attrs['class'] = 'selectmultiple selectdropdown'
        return super(SelectMultipleDropdown, self).render(name, value, attrs, choices)


class ForeignKeyRawIdWidget(forms.TextInput):
    """
    A Widget for displaying ForeignKeys in the "raw_id" interface rather than
    in a <select> box.
    """
    def __init__(self, rel, admin_site, attrs=None, using=None):
        self.rel = rel
        self.admin_site = admin_site
        self.db = using
        super(ForeignKeyRawIdWidget, self).__init__(attrs)

    def render(self, name, value, attrs=None):
        rel_to = self.rel.to
        if attrs is None:
            attrs = {}
        extra = []
        if rel_to in self.admin_site._registry:
            # The related object is registered with the same AdminSite
            related_url = reverse('xadmin:%s_%s_changelist' %
                                  (rel_to._meta.app_label,
                                   rel_to._meta.model_name),
                                  current_app=self.admin_site.name)

            params = self.url_parameters()
            if params:
                url = '?' + '&amp;'.join(['%s=%s' % (k, v) for k, v in params.items()])
            else:
                url = ''
            if "class" not in attrs:
                attrs['class'] = 'vForeignKeyRawIdAdminField'  # The JavaScript code looks for this hook.
            # TODO: "lookup_id_" is hard-coded here. This should instead use
            # the correct API to determine the ID dynamically.
            extra.append('<a href="%s%s" class="related-lookup" id="lookup_id_%s" onclick="return showRelatedObjectLookupPopup(this);"> '
                            % (related_url, url, name))
            extra.append('<img src="%s" width="16" height="16" alt="%s" /></a>'
                            % (static('admin/img/search.svg'), _('Lookup')))
        output = [super(ForeignKeyRawIdWidget, self).render(name, value, attrs)] + extra
        if value:
            output.append(self.label_for_value(value))
        return mark_safe(''.join(output))

    def base_url_parameters(self):
        return url_params_from_lookup_dict(self.rel.limit_choices_to)

    def url_parameters(self):
        from django.contrib.admin.views.main import TO_FIELD_VAR
        params = self.base_url_parameters()
        params.update({TO_FIELD_VAR: self.rel.get_related_field().name})
        return params

    def label_for_value(self, value):
        key = self.rel.get_related_field().name
        objs = set()
        text = []
        try:
            for _value in value.split(','):
                objs.add(self.rel.to._default_manager.using(self.db).get(**{key: _value}))
            for obj in objs:
                i = '&nbsp;<strong>%s</strong>' % escape(Truncator(obj).words(14, truncate='...'))
                text.append(i)
            return ','.join(text)
        except (ValueError, self.rel.to.DoesNotExist):
            return ''


class SelectMultipleRawid(ForeignKeyRawIdWidget):
    """
    A Widget for displaying ManyToMany ids in the "raw_id" interface rather than
    in a <select multiple> box.
    """
    @property
    def media(self):
        return vendor('multiselect.js', 'multiselect.css', 'xadmin.widget.multiselect_rawid.js')

    def render(self, name, value, attrs=None):
        if attrs is None:
            attrs = {}
        if self.rel.to in self.admin_site._registry:
            # The related object is registered with the same AdminSite
            attrs['class'] = 'vManyToManyRawIdAdminField'
        if value:
            value = ','.join([force_unicode(v) for v in value])
        else:
            value = ''
        return super(SelectMultipleRawid, self).render(name, value, attrs)

    def url_parameters(self):
        return self.base_url_parameters()

    def value_from_datadict(self, data, files, name):
        value = data.get(name)
        if value:
            return value.split(',')


class M2MSelectPlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        return hasattr(self.admin_view, 'style_fields') and \
            (
                'm2m_transfer' in self.admin_view.style_fields.values() or
                'm2m_dropdown' in self.admin_view.style_fields.values() or
                'm2m_rawid' in self.admin_view.style_fields.values()
            )

    def get_field_style(self, attrs, db_field, style, **kwargs):
        db = kwargs.get('using')
        if style == 'm2m_transfer' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleTransfer(db_field.verbose_name, False), 'help_text': ''}
        if style == 'm2m_dropdown' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleDropdown, 'help_text': ''}
        if style == 'm2m_rawid' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleRawid(db_field.rel, self.admin_site, using=db), 'help_text': ''}
        return attrs


xadmin.site.register_plugin(M2MSelectPlugin, ModelFormAdminView)
