
from random import Random

from django.template.context import RequestContext
from django.test.client import RequestFactory
from django.template import loader
from django.views.decorators.cache import never_cache
from django.core.urlresolvers import reverse
from django import forms
import copy
from django.db import models
from django.db.models.base import ModelBase
from django.utils.translation import ugettext as _
from django.utils.encoding import smart_unicode

from exadmin.sites import site
from exadmin.views.base import BaseAdminView, CommAdminView, filter_hook
from exadmin.views.list import ListAdminView
from exadmin.views.edit import CreateAdminView
from exadmin.layout import FormHelper
from exadmin.models import UserSettings, UserWidget
from exadmin import widgets as exwidgets

class UserWidgetAdmin(object):

    list_display = ('widget_type', 'page_id')
    list_display_links = ('widget_type',)

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == 'widget_type':
            return forms.ChoiceField(choices=[(w.widget_type, w.description) for w in widget_manager._widgets.values()])
        field = super(UserWidgetAdmin, self).formfield_for_dbfield(db_field, **kwargs)
        return field

    def queryset(self):
        return UserWidget.objects.filter(user=self.user)

    def save_models(self):
        super(UserWidgetAdmin, self).save_models()
        if self.org_obj is None:
            widget = self.new_obj
            try:
                portal_pos = UserSettings.objects.get(user=widget.user, key="dashboard:%s:pos" % widget.page_id)
                portal_pos.value = "%s,%s" % (widget.id, portal_pos.value)
                portal_pos.save()
            except Exception:
                pass

site.register(UserWidget, UserWidgetAdmin)

class WidgetManager(object):
    _widgets = None

    def __init__(self):
        self._widgets = {}

    def register(self, widget_class):
        self._widgets[widget_class.widget_type] = widget_class
        return widget_class

    def get(self, name):
        return self._widgets[name]

widget_manager = WidgetManager()

class WidgetDataError(Exception):

    def __init__(self, widget, errors):
        super(WidgetDataError, self).__init__(str(errors))
        self.widget = widget
        self.errors = errors

class BaseWidget(forms.Form):

    template = 'admin/widgets/base.html'
    description = 'Base Widget, don\'t use it.'
    base_title = None

    id = forms.IntegerField(_('Widget ID'), widget=forms.HiddenInput)
    title = forms.CharField(_('Widget Title'), required=False)

    def __init__(self, dashboard, data):
        self.dashboard = dashboard
        self.admin_site = dashboard.admin_site
        self.request = dashboard.request
        self.user = dashboard.request.user
        self.convert(data)
        super(BaseWidget, self).__init__(data)

        if not self.is_valid():
            raise WidgetDataError(self, self.errors.as_text())

        helper = FormHelper()
        helper.form_tag = False
        self.helper = helper

        self.id = self.cleaned_data['id']
        self.title = self.cleaned_data['title'] or self.base_title

    @property
    def widget(self):
        context = {'widget_id': self.id, 'widget_title': self.title, 'form': self}
        self.context(context)
        return loader.render_to_string(self.template, context, context_instance=RequestContext(self.request))

    def context(self, context):
        pass

    def convert(self, data):
        pass

    def save(self):
        value = dict([(f.name, f.value()) for f in self])
        user_widget = UserWidget.objects.get(id=self.id)
        user_widget.set_value(value)
        user_widget.save()

    def static(self, path):
        return self.dashboard.static(path)

    def media(self):
        return forms.Media()

@widget_manager.register
class HtmlWidget(BaseWidget):
    widget_type = 'html'
    description = 'Html Content Widget, can write any html content in widget.'

    content = forms.CharField(_('Html Content'), widget=exwidgets.AdminTextareaWidget, required=False)

    def context(self, context):
        context['content'] = self.cleaned_data['content']

class ModelChoiceField(forms.ChoiceField):

    def to_python(self, value):
        if isinstance(value, ModelBase):
            return value
        app_label, model_name = value.lower().split('.')
        return models.get_model(app_label, model_name)

    def prepare_value(self, value):
        if isinstance(value, ModelBase):
            value = '%s.%s' % (value._meta.app_label, value._meta.module_name)
        return value

    def valid_value(self, value):
        value = self.prepare_value(value)
        for k, v in self.choices:
            if value == smart_unicode(k):
                return True
        return False

class ModelBaseWidget(BaseWidget):

    app_label = None
    module_name = None
    model = ModelChoiceField(_(u'Target Model'))

    def __init__(self, dashboard, data):
        self.base_fields['model'].choices = [('%s.%s' % (m._meta.app_label, m._meta.module_name), \
            m._meta.verbose_name) for m, ma in dashboard.admin_site._registry.items() if self.filte_choices_model(m, ma)]
        super(ModelBaseWidget, self).__init__(dashboard, data)

        self.model = self.cleaned_data['model']
        self.app_label = self.model._meta.app_label
        self.module_name = self.model._meta.module_name

    def filte_choices_model(self, model, modeladmin):
        return True

    def model_admin_urlname(self, name, *args, **kwargs):
        return reverse("%s:%s_%s_%s" % (self.admin_site.app_name, self.app_label, \
            self.module_name, name), args=args, kwargs=kwargs)

class PartialBaseWidget(BaseWidget):

    def get_view_class(self, view_class, model=None, **opts):
        admin_class = self.admin_site._registry.get(model) if model else None
        return self.admin_site.get_view_class(view_class, admin_class, **opts)

    def get_factory(self):
        return RequestFactory()

    def setup_request(self, request):
        request.user = self.user
        return request

    def make_get_request(self, path, data={}, **extra):
        req = self.get_factory().get(path, data, **extra)
        return self.setup_request(req)

    def make_post_request(self, path, data={}, **extra):
        req = self.get_factory().post(path, data, **extra)
        return self.setup_request(req)

@widget_manager.register
class QuickBtnWidget(BaseWidget):
    widget_type = 'qbutton'
    description = 'Quick button Widget, quickly open any page.'
    template = "admin/widgets/qbutton.html"
    base_title = "Quick Buttons"

    def __init__(self, dashboard, opts):
        self.q_btns = opts.pop('btns', [])
        super(QuickBtnWidget, self).__init__(dashboard, opts)

    def get_model(self, model_or_label):
        if isinstance(model_or_label, ModelBase):
            return model_or_label
        else:
            return models.get_model(*model_or_label.lower().split('.'))

    def context(self, context):
        btns = []
        for b in self.q_btns:
            btn = {}
            if b.has_key('model'):
                model = self.get_model(b['model'])
                btn['url'] = reverse("%s:%s_%s_%s" % (self.admin_site.app_name, model._meta.app_label, \
                    model._meta.module_name, b.get('view', 'changelist')))
                btn['title'] = model._meta.verbose_name
            else:
                btn['url'] = b['url']

            if b.has_key('title'):
                btn['title'] = b['title']
            if b.has_key('icon'):
                btn['icon'] = b['icon']
            btns.append(btn)

        context.update({ 'btns': btns })

@widget_manager.register
class ListWidget(ModelBaseWidget, PartialBaseWidget):
    widget_type = 'list'
    description = 'Any Objects list Widget.'
    template = "admin/widgets/list.html"

    def __init__(self, dashboard, opts):
        self.list_params = opts.pop('params', {})
        super(ListWidget, self).__init__(dashboard, opts)

        if not self.title:
            self.title = self.model._meta.verbose_name_plural

    def context(self, context):
        req = self.make_get_request("", self.list_params)
        list_view = self.get_view_class(ListAdminView, self.model, list_per_page=10)(req)
        list_view.make_result_list()

        base_fields = list_view.base_list_display
        if len(base_fields) > 5:
            base_fields = base_fields[0:5]

        context['result_headers'] = [c for c in list_view.result_headers().cells if c.field_name in base_fields]
        context['results'] = [[o for i,o in \
            enumerate(filter(lambda c:c.field_name in base_fields, r.cells))] \
            for r in list_view.results()]
        context['result_count'] = list_view.result_count
        context['page_url'] = self.model_admin_urlname('changelist')

@widget_manager.register
class AddFormWidget(ModelBaseWidget, PartialBaseWidget):
    widget_type = 'addform'
    description = 'Add any model object Widget.'
    template = "admin/widgets/addform.html"

    def __init__(self, dashboard, opts):
        super(AddFormWidget, self).__init__(dashboard, opts)

        if self.title is None:
            self.title = _('Add %s') % self.model._meta.verbose_name

        req = self.make_get_request("")
        self.add_view = self.get_view_class(CreateAdminView, self.model, list_per_page=10)(req)
        self.add_view.instance_forms()

    def context(self, context):
        context.update({
            'addform': self.add_view.form_obj,
            'model': self.model
            })

    def media(self):
        return self.add_view.media + self.add_view.form_obj.media

class Dashboard(CommAdminView):

    widgets = []
    title = "Dashboard"

    def get_page_id(self):
        return self.request.path

    def get_portal_key(self):
        return "dashboard:%s:pos" % self.get_page_id()

    @filter_hook
    def get_widget(self, widget_or_id, data=None):
        try:
            if isinstance(widget_or_id, UserWidget):
                widget = widget_or_id
            else:
                widget = UserWidget.objects.get(user=self.user, page_id=self.get_page_id(), id=widget_or_id)
            return widget_manager.get(widget.widget_type)(self, data or widget.get_value())
        except UserWidget.DoesNotExist:
            return None

    @filter_hook
    def get_init_widget(self):
        portal = []
        widgets = self.widgets
        for col in widgets:
            portal_col = []
            for opts in col:
                widget = UserWidget(user=self.user, page_id=self.get_page_id(), widget_type=opts['type'])
                widget.set_value(opts)
                widget.save()

                portal_col.append(self.get_widget(widget))
            portal.append(portal_col)

        UserSettings(user=self.user, key="dashboard:%s:pos" % self.get_page_id(), \
            value='|'.join([','.join([str(w.id) for w in col]) for col in portal])).save()

        return portal

    @filter_hook
    def get_widgets(self):
        portal_pos = UserSettings.objects.filter(user=self.user, key=self.get_portal_key())
        if len(portal_pos):
            portal_pos = portal_pos[0]
            widgets = []
            user_widgets = dict([(uw.id, uw) for uw in UserWidget.objects.filter(user=self.user, page_id=self.get_page_id())])
            for col in portal_pos.value.split('|'):
                ws = []
                for wid in col.split(','):
                    widget = user_widgets.get(int(wid))
                    if widget:
                        ws.append(self.get_widget(widget))
                widgets.append(ws)
            return widgets
        else:
            return self.get_init_widget()

    @filter_hook
    def get_title(self):
        return self.title

    @filter_hook
    def get_context(self):
        new_context = {
            'title': self.get_title(),
        }
        context = super(Dashboard, self).get_context()
        context.update(new_context)
        return context

    @never_cache
    def get(self, request):
        self.widgets = self.get_widgets()
        context = self.get_context()
        context.update({
            'portal_key': self.get_portal_key(),
            'columns': [('span%d' % int(12/len(self.widgets)), ws) for ws in self.widgets],
            'add_widget_url': self.admin_urlname('%s_%s_add' % (UserWidget._meta.app_label, UserWidget._meta.module_name)) + \
                "?user=%s&page_id=%s" % (self.user.id, self.get_page_id())
        })
        return self.template_response('admin/dashboard.html', context)

    @never_cache
    def post(self, request):
        widget_id = request.POST['id']
        if request.POST.get('_delete', None) != 'on':
            widget = self.get_widget(widget_id, request.POST.copy())
            widget.save()
        else:
            try:
                widget = UserWidget.objects.get(user=self.user, page_id=self.get_page_id(), id=widget_id)
                widget.delete()
                # TODO update widget layout pos
            except UserWidget.DoesNotExist:
                pass

        return self.get(request)

    @filter_hook
    def get_media(self):
        media = super(Dashboard, self).get_media()
        media.add_js([self.static('exadmin/js/portal.js')])
        media.add_css({'screen': [self.static('exadmin/css/form.css'), self.static('exadmin/css/dashboard.css'), self.static('exadmin/css/font-awesome.css')]})
        for ws in self.widgets:
            for widget in ws:
                media = media + widget.media()
        return media
        