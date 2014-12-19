#coding:utf-8
from itertools import chain

import xadmin
from django import forms
from django.db.models import ManyToManyField
from django.forms.util import flatatt
from django.template import loader
from django.utils.encoding import force_text
from django.utils.html import escape, conditional_escape
from django.utils.safestring import mark_safe
from xadmin.util import vendor
from xadmin.views import BaseAdminPlugin, ModelFormAdminView
from django.test.client import RequestFactory
from xadmin.views.list import ListAdminView
from django.core.urlresolvers import reverse
from django.utils.http import urlencode
from django.template.context import RequestContext


class SelectMultipleTransfer(forms.SelectMultiple):

    @property
    def media(self):
        return vendor('xadmin.widget.select-transfer.js', 'xadmin.widget.select-transfer.css')

    def __init__(self, verbose_name, is_stacked, attrs=None, choices=()):
        self.verbose_name = verbose_name
        self.is_stacked = is_stacked
        super(SelectMultipleTransfer, self).__init__(attrs, choices)

    def render_opt(self, selected_choices, option_value, option_label):
        option_value = force_text(option_value)
        return u'<option value="%s">%s</option>' % (
            escape(option_value), conditional_escape(force_text(option_label))), bool(option_value in selected_choices)

    def render(self, name, value, attrs=None, choices=()):
        if attrs is None:
            attrs = {}
        attrs['class'] = ''
        if self.is_stacked:
            attrs['class'] += 'stacked'
        if value is None:
            value = []
        final_attrs = self.build_attrs(attrs, name=name)

        selected_choices = set(force_text(v) for v in value)
        available_output = []
        chosen_output = []

        for option_value, option_label in chain(self.choices, choices):
            if isinstance(option_label, (list, tuple)):
                available_output.append(u'<optgroup label="%s">' %
                                        escape(force_text(option_value)))
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


class SelectMultipleModelList(forms.SelectMultiple):
    template = "xadmin/forms/list.html"
    title = ''
    model = None
    model_name = None
    model_perm = 'view'
    widget_icon = 'fa fa-align-justify'
    list_params = {}
    list_count = 10
        
    def __init__(self,plugin,model,attrs=None,choices=()):
        super(SelectMultipleModelList, self).__init__(attrs,choices)
        
        self.admin_site = plugin.admin_site
        self.request = plugin.request
        self.user = plugin.request.user
        self.model = model
        self.model_name = self.model._meta.model_name
        self.app_label = self.model._meta.app_label
        req = self.make_get_request("", self.get_list_params())
        self.admin_view = self.get_view_class(ListAdminView, self.model)(req)
        
        if self.list_count:
            self.admin_view.list_per_page = self.list_count
        
        if not self.title:
            self.title = self.model._meta.verbose_name_plural
    
    def get_list_params(self):
        if self.list_params:
            return self.list_params
        return {'_p_id__in':self.choices}
        
    def has_perm(self):
        return self.admin_view.has_model_perm(self.model, self.model_perm)

    def filte_choices_model(self, model, modeladmin):
        return self.admin_view.has_model_perm(model, self.model_perm)

    def model_admin_url(self, name, *args, **kwargs):
        return reverse("%s:%s_%s_%s" % (self.admin_site.app_name, self.app_label,
                                        self.model_name, name), args=args, kwargs=kwargs)
        
    def get_view_class(self, view_class, model=None, **opts):
        admin_class = self.admin_site._registry.get(model) if model else None
        return self.admin_site.get_view_class(view_class, admin_class, **opts)

    def get_request_factory(self):
        return RequestFactory()

    def setup_request(self, request):
        request.user = self.user
        request.session = self.request.session
        return request

    def make_get_request(self, path, data={}, **extra):
        req = self.get_request_factory().get(path, data, **extra)
        return self.setup_request(req)

    def make_post_request(self, path, data={}, **extra):
        req = self.get_request_factory().post(path, data, **extra)
        return self.setup_request(req)

    #@property
    #def media(self):
    #    return vendor('xadmin.widget.select-transfer.js', 'xadmin.widget.select-transfer.css')
    
    
    def render(self, name, value, attrs=None, choices=()):
        list_view = self.admin_view
        list_view.make_result_list()

        base_fields = list_view.base_list_display
        if len(base_fields) > 5:
            base_fields = base_fields[0:5]
            
        context = {'widget_id': '', 'widget_title': self.title, 'widget_icon': self.widget_icon,
            'widget_type': 'list', 'form': [self], 'widget': [self]}

        context['result_headers'] = [c for c in list_view.result_headers().cells 
                                            if c.field_name in base_fields]
        context['results'] = [[o for i, o in enumerate(filter(lambda c:c.field_name in base_fields, r.cells))]
                                        for r in list_view.results()]
        context['result_count'] = list_view.result_count
        #context['page_url'] = self.model_admin_url('detail') + "?" + urlencode(self.list_params)
        self.request.context = context
        return loader.render_to_string(self.template, context, context_instance=RequestContext(self.request))
        

class M2MSelectPlugin(BaseAdminPlugin):

    def init_request(self, *args, **kwargs):
        return hasattr(self.admin_view, 'style_fields') and \
            (
                'm2m_transfer' in self.admin_view.style_fields.values() or
                'm2m_dropdown' in self.admin_view.style_fields.values() or
                'm2m_list' in self.admin_view.style_fields.values()
            )

    def get_field_style(self, attrs, db_field, style, **kwargs):
        if style == 'm2m_transfer' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleTransfer(db_field.verbose_name, False), 'help_text': ''}
        if style == 'm2m_dropdown' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleDropdown, 'help_text': ''}
        if style == 'm2m_list' and isinstance(db_field, ManyToManyField):
            return {'widget': SelectMultipleModelList(plugin=self,model=db_field.related.model), 'help_text': ''}
        return attrs


xadmin.site.register_plugin(M2MSelectPlugin, ModelFormAdminView)
