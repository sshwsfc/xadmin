from django.conf import settings
from django.conf.urls import patterns
from django.middleware.csrf import _sanitize_token, constant_time_compare
from django.utils.http import same_origin
from tastypie import fields
from tastypie.api import NamespacedApi
from tastypie.authentication import Authentication
from tastypie.authorization import DjangoAuthorization
from tastypie.resources import ModelDeclarativeMetaclass, NamespacedModelResource

class SessionAuthentication(Authentication):
    def is_authenticated(self, request, **kwargs):
        if request.method in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            return request.user.is_authenticated()

        if getattr(request, '_dont_enforce_csrf_checks', False):
            return request.user.is_authenticated()

        csrf_token = _sanitize_token(request.COOKIES.get(settings.CSRF_COOKIE_NAME, ''))

        if request.is_secure():
            referer = request.META.get('HTTP_REFERER')

            if referer is None:
                return False

            good_referer = 'https://%s/' % request.get_host()

            if not same_origin(referer, good_referer):
                return False

        request_csrf_token = request.META.get('HTTP_X_CSRFTOKEN', '')

        if not constant_time_compare(request_csrf_token, csrf_token):
            return False

        return request.user.is_authenticated()

    def get_identifier(self, request):
        return request.user.username


def get_api_rel_field(f):
    internal_type = f.get_internal_type()
    if internal_type == 'ForeignKey':
        return fields.CharField(f.name)
    # elif internal_type == 'ManyToManyField':
    #     return fields.ManyToManyField(f.rel.to, f.name)
    return None

class AdminModelMetaclass(ModelDeclarativeMetaclass):

    def __new__(cls, model, admin_class, admin_site):
        opts = model._meta

        rel_fields = dict(filter(lambda x:bool(x[1]), [(f.name, get_api_rel_field(f)) for f in opts.fields if getattr(f, 'rel')]))

        meta_attrs = {
            'authentication': SessionAuthentication(),
            'authorization': DjangoAuthorization(),
            'allowed_methods': getattr(admin_class, 'api_allowed_methods', ['get', 'post', 'put', 'delete', 'patch']),
            'default_format': 'application/json',
            'resource_name': opts.module_name,
            'object_class': model,
            'urlconf_namespace': admin_site.app_name,
            'include_resource_uri': False,
            'queryset': model._default_manager.get_query_set()
        }

        overrides_attr = ('ordering', 'fields', 'excludes')
        for attr_name in overrides_attr:
            if hasattr(admin_class, attr_name):
                meta_attrs[attr_name] = getattr(admin_class, attr_name)

        meta_class = type.__new__(AdminModelMetaclass, 'Meta', (), meta_attrs)
        class_name = '%s%sResource' % (opts.app_label, opts.module_name)

        new_attrs = {'Meta': meta_class}
        #new_attrs.update(rel_fields)

        return super(AdminModelMetaclass, cls).__new__(cls, class_name, (NamespacedModelResource,), new_attrs)

class DataApiManager(object):

    def __init__(self):
        self._apis = {}

    def register(self, model, admin_class, admin_site):
        api_name = model._meta.app_label
        namespace = admin_site.app_name
        resource_class = AdminModelMetaclass.__new__(AdminModelMetaclass, model, admin_class, admin_site)
        self._apis.setdefault(api_name, NamespacedApi(api_name, namespace)).register(resource_class())

    @property
    def urls(self):
        urls = []
        for api in self._apis.values():
            urls.extend(api.urls)
        return urls

    def has_resource(self, model):
        opts = model._meta
        api_name = opts.app_label
        resouce_name = opts.module_name
        return self._apis.has_key(api_name) and self._apis[api_name]._registry.has_key(resouce_name)

    def get_resource(self, model):
        opts = model._meta
        api_name = opts.app_label
        resouce_name = opts.module_name
        if self._apis.has_key(api_name) and self._apis[api_name]._registry.has_key(resouce_name):
            return self._apis[api_name]._registry[resouce_name]
        return None

api_manager = DataApiManager()

def get_urls(admin_site, *args, **kwrags):
    for model, admin_class in admin_site._registry.items():
        if getattr(admin_class, 'api_enable', True):
            api_manager.register(model, admin_class, admin_site)

    return patterns('',  *api_manager.urls)


