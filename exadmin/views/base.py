import functools, datetime, decimal

from django import forms
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse, NoReverseMatch
from django.http import HttpResponse
from django.template import Context, Template
from django.utils import simplejson
from django.utils.encoding import smart_unicode
from django.utils.http import urlencode
from django.utils.itercompat import is_iterable
from django.utils.safestring import mark_safe
from django.views.generic import View
from django.template.response import TemplateResponse
from django.utils.text import capfirst
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from exadmin.util import static

csrf_protect_m = method_decorator(csrf_protect)

class IncorrectLookupParameters(Exception):
    pass

def filter_chain(filters, token, func, *args, **kwargs):
    if token == -1:
        return func()
    else:
        def _inner_method():
            fm = filters[token]
            return fm(func if hasattr(fm, 'callback') else func(), *args, **kwargs)
        return filter_chain(filters, token-1, _inner_method, *args, **kwargs)

def filter_hook(func):
    tag = func.__name__
    @functools.wraps(func)
    def method(self, *args, **kwargs):

        def _inner_method():
            return func(self, *args, **kwargs)

        if self.plugins:
            filters = [(getattr(getattr(p, tag), 'priority', 10), getattr(p, tag)) \
                for p in self.plugins if callable(getattr(p, tag, None))]
            filters = [f for p,f in sorted(filters, key=lambda x:x[0])]
            return filter_chain(filters, len(filters)-1, _inner_method, *args, **kwargs)
        else:
            return _inner_method()
    return method

class BaseAdminPlugin(object):

    def __init__(self, admin_view):
        self.admin_view = admin_view
        self.admin_site = admin_view.admin_site
        if hasattr(admin_view, 'model'):
            self.model = admin_view.model
            self.opts = admin_view.model._meta

    def init_request(self, *args, **kwargs):
        pass
        
    def static(self, path):
        return static(path)

def inclusion_tag(file_name, context_class=Context, takes_context=False):
    def wrap(func):
        @functools.wraps(func)
        def method(self, context, nodes, *arg, **kwargs):
            _dict  = func(self, context, nodes, *arg, **kwargs)
            from django.template.loader import get_template, select_template
            if isinstance(file_name, Template):
                t = file_name
            elif not isinstance(file_name, basestring) and is_iterable(file_name):
                t = select_template(file_name)
            else:
                t = get_template(file_name)
            new_context = context_class(_dict, **{
                'autoescape': context.autoescape,
                'current_app': context.current_app,
                'use_l10n': context.use_l10n,
                'use_tz': context.use_tz,
            })
            new_context['admin_view'] = context['admin_view']
            csrf_token = context.get('csrf_token', None)
            if csrf_token is not None:
                new_context['csrf_token'] = csrf_token
            nodes.append(t.render(new_context))

        return method
    return wrap

class JSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.date):
            return o.strftime('%Y-%m-%d')
        elif isinstance(o, datetime.datetime):
            return o.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(o, decimal.Decimal):
            return str(o)
        else:
            try:
                return super(JSONEncoder, self).default(o)
            except Exception:
                return smart_unicode(o)

class BaseAdminView(View):
    """ Base Admin view, support some comm attrs."""
    admin_site = None
    plugins = []

    def __init__(self, admin_site, plugins=None, **kwargs):
        self.admin_site = admin_site
        if plugins:
            self.plugins = [p(self) for p in plugins]
        super(BaseAdminView, self).__init__(**kwargs)

    def dispatch(self, request, *args, **kwargs):
        # Try to dispatch to the right method; if a method doesn't exist,
        # defer to the error handler. Also defer to the error handler if the
        # request method isn't on the approved list.
        if request.method.lower() in self.http_method_names:
            handler = getattr(self, request.method.lower(), self.http_method_not_allowed)
        else:
            handler = self.http_method_not_allowed
        self.request = request
        self.request_method = request.method.lower()
        self.user = request.user
        self.args = args
        self.kwargs = kwargs
        self.init_plugin(*args, **kwargs)
        self.init_request(*args, **kwargs)
        return handler(request, *args, **kwargs)

    def init_request(self, *args, **kwargs):
        pass

    def init_plugin(self, *args, **kwargs):
        for p in self.plugins:
            p.request = self.request
            p.user = self.user
            p.args = self.args
            p.kwargs = self.kwargs
            p.init_request(*args, **kwargs)

    def get_context(self):
        return {'admin_view': self, 'media': self.media}

    def admin_urlname(self, name, *args, **kwargs):
        return reverse('%s:%s' % (self.admin_site.app_name, name), args=args, kwargs=kwargs)

    def get_query_string(self, new_params=None, remove=None):
        if new_params is None: new_params = {}
        if remove is None: remove = []
        p = dict(self.request.GET.items()).copy()
        for r in remove:
            for k in p.keys():
                if k.startswith(r):
                    del p[k]
        for k, v in new_params.items():
            if v is None:
                if k in p:
                    del p[k]
            else:
                p[k] = v
        return '?%s' % urlencode(p)

    def get_form_params(self, new_params=None, remove=None):
        if new_params is None: new_params = {}
        if remove is None: remove = []
        p = dict(self.request.GET.items()).copy()
        for r in remove:
            for k in p.keys():
                if k.startswith(r):
                    del p[k]
        for k, v in new_params.items():
            if v is None:
                if k in p:
                    del p[k]
            else:
                p[k] = v
        return mark_safe(''.join(
            '<input type="hidden" name="%s" value="%s"/>' % (k, v) for k,v in p.items() if v))

    def render_response(self, content, response_type='json'):
        if response_type == 'json':
            json = simplejson.dumps(content, cls=JSONEncoder, ensure_ascii=False)
            return HttpResponse(json)
        return HttpResponse(content)

    def template_response(self, template, context):
        return TemplateResponse(self.request, template, context, current_app=self.admin_site.name)

    def static(self, path):
        return static(path)

    @property
    def media(self):
        return self.get_media()

    @filter_hook
    def get_media(self):
        return forms.Media()

class CommAdminView(BaseAdminView):
    """
    User logined base admin view, in CommAdminView, self.request.user is setup and vaild.
    CommAdminView also get some page comm components job.
    """

    def get_model_perms(self):
        return {
            'add': True,
            'change': True,
            'delete': True,
        }

    @filter_hook
    def get_nav_menu(self):
        nav_menu = {}
        user = self.user
        site_name = self.admin_site.name
        for model, model_admin in self.admin_site._registry.items():
            app_label = model._meta.app_label
            has_module_perms = user.has_module_perms(app_label)

            if has_module_perms:
                perms = self.get_model_perms()

                # Check whether user has any perm for this module.
                # If so, add the module to the model_list.
                if True in perms.values():
                    info = (app_label, model._meta.module_name)
                    model_dict = {
                        'title': capfirst(model._meta.verbose_name_plural),
                        'perms': perms,
                    }
                    if perms.get('change', False):
                        try:
                            model_dict['url'] = reverse('admin:%s_%s_changelist' % info, current_app=site_name)
                        except NoReverseMatch:
                            pass
                    if perms.get('add', False):
                        try:
                            model_dict['add_url'] = reverse('admin:%s_%s_add' % info, current_app=site_name)
                        except NoReverseMatch:
                            pass
                    app_key = "app:%s" % app_label
                    if app_key in nav_menu:
                        nav_menu[app_key]['menus'].append(model_dict)
                    else:
                        nav_menu[app_key] = {
                            'title': app_label.title(),
                            #'url': reverse('admin:app_list', kwargs={'app_label': app_label}, current_app=site_name),
                            'menus': [model_dict],
                        }
        return nav_menu

    @filter_hook
    def get_context(self):
        context = super(CommAdminView, self).get_context()
        context.update({
            'nav_menu': self.get_nav_menu().values()
            })
        return context

    def message_user(self, message):
        """
        Send a message to the user. The default implementation
        posts a message using the django.contrib.messages backend.
        """
        messages.info(self.request, message)


class ModelAdminView(CommAdminView):

    fields = None
    exclude = None
    ordering = None
    model = None

    def __init__(self, model, admin_site, plugins=None, **kwargs):
        self.model = model
        self.opts = model._meta
        self.app_label = model._meta.app_label
        super(ModelAdminView, self).__init__(admin_site, plugins, **kwargs)

    @filter_hook
    def get_object(self, object_id):
        """
        Get model object instance by object_id, used for change admin view
        """
        # first get base admin view property queryset, return default model queryset
        queryset = self.queryset()
        model = queryset.model
        try:
            object_id = model._meta.pk.to_python(object_id)
            return queryset.get(pk=object_id)
        except (model.DoesNotExist, ValidationError):
            return None

    def model_admin_urlname(self, name, *args, **kwargs):
        return reverse("%s:%s_%s_%s" % (self.admin_site.app_name, self.opts.app_label, \
            self.opts.module_name, name), args=args, kwargs=kwargs)

    def get_model_perms(self):
        """
        Returns a dict of all perms for this model. This dict has the keys
        ``add``, ``change``, and ``delete`` mapping to the True/False for each
        of those actions.
        """
        return {
            'add': self.has_add_permission(),
            'change': self.has_change_permission(),
            'delete': self.has_delete_permission(),
        }

    def get_ordering(self):
        """
        Hook for specifying field ordering.
        """
        return self.ordering or ()  # otherwise we might try to *None, which is bad ;)
        
    def queryset(self):
        """
        Returns a QuerySet of all model instances that can be edited by the
        admin site. This is used by changelist_view.
        """
        return self.model._default_manager.get_query_set()

    def has_add_permission(self):
        """
        Returns True if the given request has permission to add an object.
        Can be overriden by the user in subclasses.
        """
        opts = self.opts
        return self.user.has_perm(opts.app_label + '.' + opts.get_add_permission())

    def has_change_permission(self, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance, the default implementation doesn't examine the
        `obj` parameter.

        Can be overriden by the user in subclasses. In such case it should
        return True if the given request has permission to change the `obj`
        model instance. If `obj` is None, this should return True if the given
        request has permission to change *any* object of the given type.
        """
        opts = self.opts
        return self.user.has_perm(opts.app_label + '.' + opts.get_change_permission())

    def has_delete_permission(self, obj=None):
        """
        Returns True if the given request has permission to change the given
        Django model instance, the default implementation doesn't examine the
        `obj` parameter.

        Can be overriden by the user in subclasses. In such case it should
        return True if the given request has permission to delete the `obj`
        model instance. If `obj` is None, this should return True if the given
        request has permission to delete *any* object of the given type.
        """
        opts = self.opts
        return self.user.has_perm(opts.app_label + '.' + opts.get_delete_permission())

