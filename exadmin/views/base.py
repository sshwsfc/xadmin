import functools, datetime, decimal

from django import forms
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.template import Context, Template
from django.utils import simplejson
from django.utils.encoding import smart_unicode
from django.utils.http import urlencode
from django.utils.itercompat import is_iterable
from django.utils.safestring import mark_safe
from django.views.generic import View
from django.template.response import TemplateResponse

class IncorrectLookupParameters(Exception):
    pass

def filter_hook(func):
    tag = func.__name__
    @functools.wraps(func)
    def method(self, *args, **kwargs):
        result = func(self, *args, **kwargs)
        if self.plugins:
            filters = [(getattr(getattr(p, tag), 'priority', 10), getattr(p, tag)) \
                for p in self.plugins if callable(getattr(p, tag, None))]
            for p, filter_func in sorted(filters, key=lambda x:x[0]):
                result = filter_func(result, *args, **kwargs)
        return result
    return method

def action_hook(func):
    tag = func.__name__
    @functools.wraps(func)
    def method(self, *args, **kwargs):
        func(self, *args, **kwargs)
        if self.plugins:
            filters = [(getattr(getattr(p, tag), 'priority', 10), getattr(p, tag)) \
                for p in self.plugins if callable(getattr(p, tag, None))]
            for p, filter_func in sorted(filters, key=lambda x:x[0]):
                filter_func(*args, **kwargs)
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

    def message_user(self, message):
        """
        Send a message to the user. The default implementation
        posts a message using the django.contrib.messages backend.
        """
        messages.info(self.request, message)

    def render_response(self, content, response_type='json'):
        if response_type == 'json':
            json = simplejson.dumps(content, cls=JSONEncoder, ensure_ascii=False)
            return HttpResponse(json)
        return HttpResponse(content)

    def template_response(self, template, context):
        return TemplateResponse(self.request, template, context, current_app=self.admin_site.name)

    @property
    def media(self):
        return self.get_media()

    def get_media(self):
        return forms.Media()

class ModelAdminView(BaseAdminView):

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

