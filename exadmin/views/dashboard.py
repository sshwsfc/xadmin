
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

from exadmin.views.base import BaseAdminView, CommAdminView, filter_hook
from exadmin.views.list import ListAdminView
from exadmin.views.edit import CreateAdminView
from exadmin.layout import FormHelper
from exadmin.models import UserSettings

class PartialView(BaseAdminView):
    pass

class WidgetDataError(Exception):

    def __init__(self, widget, errors):
        super(WidgetDataError, self).__init__(str(errors))
        self.widget = widget
        self.errors = errors

class BaseWidget(forms.Form):

    template = 'admin/widgets/base.html'
    description = 'Base Widget, don\'t use it.'
    base_title = None

    id = forms.CharField(_('Widget ID'), widget=forms.HiddenInput)
    title = forms.CharField(_('Widget Title'))

    def __init__(self, dashboard, data):
        self.dashboard = dashboard
        self.admin_site = dashboard.admin_site
        self.request = dashboard.request
        self.user = dashboard.request.user
        super(BaseWidget, self).__init__(data)

        if not self.is_valid():
            raise WidgetDataError(self, self.errors)

        helper = FormHelper()
        helper.form_tag = False
        self.helper = helper

        self.id = self.cleaned_data['id']
        self.title = self.cleaned_data.get('title', self.base_title)

    def __repr__(self):
        context = {'widget': self}
        self.context(context)
        return loader.render_to_string(self.template, context, context_instance=RequestContext(self.request))

    def context(self, context):
        pass

    def save(self):
        pass

    def static(self, path):
        return self.dashboard.static(path)

    def media(self):
        return forms.Media()

class WidgetManager(object):
    _widgets = None

    def __init__(self):
        self._widgets = {}

    def register(self, name, widget_class):
        self._widgets[name] = widget_class

    def get(self, name):
        return self._widgets[name]

widget_manager = WidgetManager()

class HtmlWidget(BaseWidget):
    description = 'Html Content Widget, can write any html content in widget.'
widget_manager.register("html", HtmlWidget)

class ModelOptForm(BaseOptForm):
    model = forms.CharField(_('Target Model'))

class ModelBaseWidget(BaseWidget):

    app_label = None
    model_name = None
    model = forms.CharField(_('Target Model'))

    def __init__(self, dashboard, opts):
        super(ModelBaseWidget, self).__init__(dashboard, opts)
        model = opts.pop('model')
        if isinstance(model, ModelBase):
            self.model = model
            self.app_label = model._meta.app_label
            self.model_name = model._meta.module_name
        else:
            self.app_label, self.model_name = model.lower().split('.')
            self.model = models.get_model(self.app_label, self.model_name)
        super(ModelBaseWidget, self).__init__(dashboard, opts)

    def form_data(self):
        data = super(ModelBaseWidget, self).form_data()
        data['model'] = "%s.%s" % (self.app_label, self.model_name)
        return data

    def model_admin_urlname(self, name, *args, **kwargs):
        return reverse("%s:%s_%s_%s" % (self.admin_site.app_name, self.app_label, \
            self.model_name, name), args=args, kwargs=kwargs)

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

class QuickBtnWidget(BaseWidget):
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

widget_manager.register("qbutton", QuickBtnWidget)

class ListWidget(ModelBaseWidget, PartialBaseWidget):
    description = 'Any Objects list Widget.'
    template = "admin/widgets/list.html"

    def __init__(self, dashboard, opts):
        self.list_params = opts.pop('params', {})
        super(ListWidget, self).__init__(dashboard, opts)

        if self.title is None:
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

widget_manager.register("list", ListWidget)

class AddFormWidget(ModelBaseWidget, PartialBaseWidget):
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

widget_manager.register("addform", AddFormWidget)

class Dashboard(CommAdminView):

    widgets = []
    title = "Dashboard"
    page_id = None

    def get_page_id(self):
        return self.page_id if self.page_id else self.request.path.replace('/', '_')

    def get_portal_key(self):
        return "dashboard:%s:pos" % self.get_page_id()

    def get_widget_key(self, widget_id):
        return "dashboard:%s:%s" % (self.get_page_id(), widget_id)

    def _gen_widget_id(self):
        str = ''
        chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789'
        length = len(chars) - 1
        random = Random()
        for i in range(16):
            str+=chars[random.randint(0, length)]
        return str

    @filter_hook
    def get_widget(self, widget_id):
        try:
            opts = UserSettings.objects.get(user=self.user, key=self.get_widget_key(widget_id)).json_value()
            opts['id'] = widget_id
            return widget_manager.get(opts['type'])(self, opts)
        except UserSettings.DoesNotExist:
            return None

    @filter_hook
    def get_init_widget(self):
        portal = []
        widgets = self.widgets
        for col in widgets:
            portal_col = []
            for opts in col:
                wid = self._gen_widget_id()
                widget = copy.copy(opts)
                widget['id'] = wid

                widget_us = UserSettings(user=self.user, key=self.get_widget_key(wid))
                widget_us.set_json(widget)
                widget_us.save()

                portal_col.append(widget_manager.get(widget['type'])(self, widget))

            portal.append(portal_col)

        UserSettings(user=self.user, key="dashboard:%s:pos" % self.get_page_id(), \
            value='|'.join([','.join([w.id for w in col]) for col in portal])).save()

        return portal

    @filter_hook
    def get_widgets(self):
        portal_pos = UserSettings.objects.filter(user=self.user, key=self.get_portal_key())
        if len(portal_pos):
            portal_pos = portal_pos[0]
            widgets = []
            for col in portal_pos.value.split('|'):
                ws = []
                for w in col.split(','):
                    widget = self.get_widget(w)
                    if widget:
                        ws.append(widget)
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
            'columns': [('span%d' % int(12/len(self.widgets)), ws) for ws in self.widgets]
        })
        return self.template_response('admin/dashboard.html', context)

    @never_cache
    def post(self, request):
        widget_id = request.POST['id']
        widget = self.get_widget(widget_id)
        form = widget.form(request.POST)

        if form.is_valid():


        widget_manager.get(widget_type)
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
        