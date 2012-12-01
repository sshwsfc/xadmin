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

class PartialView(BaseAdminView):
    pass

class BaseWidget(object):

    template = 'admin/widgets/base.html'
    description = 'Base Widget, don\'t use it.'
    can_add = False
    can_delete = True
    base_title = None

    def __init__(self, dashboard, opts):
        self.dashboard = dashboard
        self.admin_site = dashboard.admin_site
        self.request = dashboard.request
        self.user = dashboard.request.user
        self.title = opts.pop('title', self.base_title)
        self.opts = opts

    def __repr__(self):
        context = {'form': self.form(), 'widget': self}
        context.update(self.opts)
        self.context(context)
        return loader.render_to_string(self.template, context)

    def context(self, context):
        pass

    def form(self):
        pass

    def options(self):
        pass

    def update(self, datas):
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

class ModelBaseWidget(BaseWidget):

    app_label = None
    model_name = None

    def __init__(self, dashboard, opts):
        model = opts.pop('model')
        if isinstance(model, ModelBase):
            self.model = model
            self.app_label = model._meta.app_label
            self.model_name = model._meta.module_name
        else:
            self.app_label, self.model_name = model.lower().split('.')
            self.model = models.get_model(self.app_label, self.model_name)
        super(ModelBaseWidget, self).__init__(dashboard, opts)

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
    column_num = 2
    title = "Dashboard"

    @filter_hook
    def get_user_widgets(self):
        pass

    @filter_hook
    def get_widgets(self):
        return self.get_user_widgets() or copy.deepcopy(self.widgets)

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
        self.widgets = [[widget_manager.get(opts['type'])(self, opts) for opts in ws] for ws in self.get_widgets()]

        context = self.get_context()
        context.update({
            'columns': [('span%d' % int(12/self.column_num), self.widgets[i] if len(self.widgets) > i else []) \
                for i in xrange(self.column_num)]
        })
        return self.template_response('admin/dashboard.html', context)

    @filter_hook
    def get_media(self):
        media = super(Dashboard, self).get_media()
        media.add_js([self.static('exadmin/js/portal.js')])
        media.add_css({'screen': [self.static('exadmin/css/form.css'), self.static('exadmin/css/dashboard.css'), self.static('exadmin/css/font-awesome.css')]})
        for ws in self.widgets:
            for widget in ws:
                media = media + widget.media()
        return media
        