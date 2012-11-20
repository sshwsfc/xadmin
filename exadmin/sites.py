import sys
from functools import update_wrapper

from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.core.urlresolvers import reverse
from django.db.models.base import ModelBase
from django.http import HttpResponseRedirect
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect

reload(sys)
sys.setdefaultencoding( "utf-8" )

class AlreadyRegistered(Exception):
    pass

class NotRegistered(Exception):
    pass

class MergeAdminMetaclass(type):
    def __new__(cls, name, bases, attrs):
        return type.__new__(cls, name, bases, attrs)

class AdminSite(object):

    def __init__(self, name='admin', app_name='admin'):
        self.name = name
        self.app_name = app_name
    
        self._registry = {} # model_class class -> admin_class class
        self._registry_views = [] # url instance contains (path, admin_view class, name)
        self._registry_modelviews = [] # url instance contains (path, admin_view class, name)
        self._registry_plugins = {} # view_class class -> plugin_class class

    def copy_registry(self):
        import copy
        return {
            'models': copy.copy(self._registry),
            'views': copy.copy(self._registry_views),
            'modelviews': copy.copy(self._registry_modelviews),
            'plugins': copy.copy(self._registry_plugins),
        }

    def restore_registry(self, data):
        self._registry = data['models']
        self._registry_views = data['views']
        self._registry_modelviews = data['modelviews']
        self._registry_plugins = data['plugins']

    def register_modelview(self, path, admin_view_class, name):
        from exadmin.views.base import BaseAdminView
        if issubclass(admin_view_class, BaseAdminView):
            self._registry_modelviews.append((path, admin_view_class, name))
        else:
            raise ImproperlyConfigured(u'The registered view class %s isn\'t subclass of %s' % \
                (admin_view_class.__name__, BaseAdminView.__name__))

    def register_view(self, path, admin_view_class, name):
        self._registry_views.append((path, admin_view_class, name))

    def register_plugin(self, plugin_class, admin_view_class):
        from exadmin.views.base import BaseAdminPlugin
        if issubclass(plugin_class, BaseAdminPlugin):
            self._registry_plugins.setdefault(admin_view_class, []).append(plugin_class)
        else:
            raise ImproperlyConfigured(u'The registered plugin class %s isn\'t subclass of %s' % \
                (plugin_class.__name__, BaseAdminPlugin.__name__))

    def register(self, model_or_iterable, admin_class=object, **options):
        if isinstance(model_or_iterable, ModelBase):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if model._meta.abstract:
                raise ImproperlyConfigured('The model %s is abstract, so it '
                      'cannot be registered with admin.' % model.__name__)

            if model in self._registry:
                raise AlreadyRegistered('The model %s is already registered' % model.__name__)

            # If we got **options then dynamically construct a subclass of
            # admin_class with those **options.
            if options:
                # For reasons I don't quite understand, without a __module__
                # the created class appears to "live" in the wrong place,
                # which causes issues later on.
                options['__module__'] = __name__
                admin_class = type("%sAdmin" % model.__name__, (admin_class,), options)

            # Instantiate the admin class to save in the registry
            self._registry[model] = admin_class

    def unregister(self, model_or_iterable):
        """
        Unregisters the given model(s).

        If a model isn't already registered, this will raise NotRegistered.
        """
        if isinstance(model_or_iterable, ModelBase):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if model not in self._registry:
                raise NotRegistered('The model %s is not registered' % model.__name__)
            del self._registry[model]

    def has_permission(self, request):
        """
        Returns True if the given HttpRequest has permission to view
        *at least one* page in the admin site.
        """
        return request.user.is_active and request.user.is_staff

    def check_dependencies(self):
        """
        Check that all things needed to run the admin have been correctly installed.

        The default implementation checks that LogEntry, ContentType and the
        auth context processor are installed.
        """
        from django.contrib.contenttypes.models import ContentType

        if not ContentType._meta.installed:
            raise ImproperlyConfigured("Put 'django.contrib.contenttypes' in "
                "your INSTALLED_APPS setting in order to use the admin application.")
        if not ('django.contrib.auth.context_processors.auth' in settings.TEMPLATE_CONTEXT_PROCESSORS or
            'django.core.context_processors.auth' in settings.TEMPLATE_CONTEXT_PROCESSORS):
            raise ImproperlyConfigured("Put 'django.contrib.auth.context_processors.auth' "
                "in your TEMPLATE_CONTEXT_PROCESSORS setting in order to use the admin application.")

    def admin_view(self, view, cacheable=False):
        """
        Decorator to create an admin view attached to this ``AdminSite``. This
        wraps the view and provides permission checking by calling
        ``self.has_permission``.

        You'll want to use this from within ``AdminSite.get_urls()``:

            class MyAdminSite(AdminSite):

                def get_urls(self):
                    from django.conf.urls import patterns, url

                    urls = super(MyAdminSite, self).get_urls()
                    urls += patterns('',
                        url(r'^my_view/$', self.admin_view(some_view))
                    )
                    return urls

        By default, admin_views are marked non-cacheable using the
        ``never_cache`` decorator. If the view can be safely cached, set
        cacheable=True.
        """
        def inner(request, *args, **kwargs):
            # if not self.has_permission(request):
            #     if request.path == reverse('admin:logout',
            #                                current_app=self.name):
            #         index_path = reverse('admin:index', current_app=self.name)
            #         return HttpResponseRedirect(index_path)
            #     return self.login(request)
            return view(request, *args, **kwargs)
        if not cacheable:
            inner = never_cache(inner)
        # We add csrf_protect here so this function can be used as a utility
        # function for any view, without having to repeat 'csrf_protect'.
        if not getattr(view, 'csrf_exempt', False):
            inner = csrf_protect(inner)
        return update_wrapper(inner, view)

    def _get_plugins_by_view(self, admin_view_class):
        from exadmin.views import BaseAdminView
        plugins = []
        for klass in admin_view_class.mro():
            if klass == BaseAdminView or issubclass(klass, BaseAdminView):
                plugins.extend(self._registry_plugins.get(klass, []))
        return plugins

    def _create_admin_view(self, admin_view_class):
        plugins = self._get_plugins_by_view(admin_view_class)
        return admin_view_class.as_view(admin_site=self, plugins=plugins)

    def _get_merge_attrs(self, admin_class, plugin_class):
        return dict([(name, getattr(admin_class, name)) for name in dir(admin_class) \
                    if name[0] != '_' and hasattr(plugin_class, name)])

    def _create_model_plugin(self, model, admin_class):
        def merge_class(plugin_class):
            if admin_class:
                attrs = self._get_merge_attrs(admin_class, plugin_class)
                if attrs:
                    plugin_class = MergeAdminMetaclass(
                        '%s%s%s' % (model._meta.app_label, model._meta.module_name, plugin_class.__name__), \
                        (plugin_class,), attrs)
            return plugin_class
        return merge_class

    def _create_model_admin_view(self, admin_view_class, model, admin_class):
        plugins = map(self._create_model_plugin(model, admin_class), \
            self._get_plugins_by_view(admin_view_class))
        if admin_class:
            admin_view_class = MergeAdminMetaclass(
                '%s%s%s' % (model._meta.app_label, model._meta.module_name, admin_view_class.__name__), \
                (admin_class, admin_view_class), {})
        return admin_view_class.as_view(model=model, admin_site=self, plugins=plugins)

    def get_urls(self):
        from django.conf.urls import patterns, url, include
        from exadmin.views.base import BaseAdminView

        if settings.DEBUG:
            self.check_dependencies()

        def wrap(view, cacheable=False):
            def wrapper(*args, **kwargs):
                return self.admin_view(view, cacheable)(*args, **kwargs)
            return update_wrapper(wrapper, view)

        # Admin-site-wide views.
        urlpatterns = patterns('',
            url(r'^jsi18n/$', wrap(self.i18n_javascript, cacheable=True), name='jsi18n')
        )

        # Registed admin views
        urlpatterns += patterns('',
            *[url(path, wrap(self._create_admin_view(clz_or_func)) if type(clz_or_func) == type and issubclass(clz_or_func, BaseAdminView) else include(clz_or_func(self)), \
                name=name) for path, clz_or_func, name in self._registry_views]
        )

        # Add in each model's views.
        for model, admin_class in self._registry.iteritems():
            view_urls = [url(path, self._create_model_admin_view(clz, model, admin_class), \
                name=name % (model._meta.app_label, model._meta.module_name)) \
                for path, clz, name in self._registry_modelviews]
            urlpatterns += patterns('',
                url(r'^%s/%s/' % (model._meta.app_label, model._meta.module_name),
                    include(patterns('', *view_urls)))
            )
            
        return urlpatterns

    @property
    def urls(self):
        return self.get_urls(), self.app_name, self.name

    def i18n_javascript(self, request):
        """
        Displays the i18n JavaScript that the Django admin requires.

        This takes into account the USE_I18N setting. If it's set to False, the
        generated JavaScript will be leaner and faster.
        """
        if settings.USE_I18N:
            from django.views.i18n import javascript_catalog
        else:
            from django.views.i18n import null_javascript_catalog as javascript_catalog
        return javascript_catalog(request, packages=['django.conf', 'django.contrib.admin'])

# This global object represents the default admin site, for the common case.
# You can instantiate AdminSite in your own code to create a custom admin site.
site = AdminSite()
