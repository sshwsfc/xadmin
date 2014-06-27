# coding=utf-8
import sys
from functools import update_wrapper
from django.conf import settings
from django.core.exceptions import ImproperlyConfigured
from django.db.models.base import ModelBase
from django.views.decorators.cache import never_cache

#设置系统的编码为utf-8
reload(sys)
sys.setdefaultencoding("utf-8")


class AlreadyRegistered(Exception):
    """
    如果一个 model 已经在 :class:`AdminSite` 注册过，当尝试再次注册时会抛出这个异常。
    """
    pass


class NotRegistered(Exception):
    """
    当一个model并未在 :class:`AdminSite` 注册，当调用 :meth:`AdminSite.unregister` 想要取消该model的注册就会抛出该异常。
    """
    pass


class MergeAdminMetaclass(type):
    """
    用来生成 admin view class 的原类。

    目前该原类没有做什么特殊的工作。接下来的版本该原类可能会给 admin view class 注入一些公共的属性。
    """
    def __new__(cls, name, bases, attrs):
        return type.__new__(cls, str(name), bases, attrs)


class AdminSite(object):
    """
    xadmin最核心的类，管理整个xadmin站点的所有注册内容。

    一般一个管理站点只有一个 ``AdminSite`` 实例，该实例主要完成以下工作:

        * 注册管理所有 xadmin 需要的信息
        * 创建 ``admin view class``
        * 注册 django urls

    其中，xadmin 需要的信息包括以下信息：

        * 需要 xadmin 管理的 models，以及各 model 的 admin 信息
        * 注册的 ``admin view class``
        * 注册的 ``model admin view class``
        * 注册的各种插件
    """
    def __init__(self, name='xadmin'):
        self.name = name
        self.app_name = 'xadmin'

        self._registry = {}  # model_class class -> admin_class class
        self._registry_avs = {}  # admin_view_class class -> admin_class class
        self._registry_settings = {}  # settings name -> admin_class class
        self._registry_views = []

        #: 保存所有 Model Base Admin View Class
        self._registry_modelviews = []

        #: 保存所有系统插件信息， 
        #    *key*   : 插件绑定的 Admin View 类 
        #    *value* : 插件 类
        self._registry_plugins = {}

        #: 创建好的 admin view 会被缓存起来，同样的， 
        #    *key*   : 需要创建的 Admin View 的 class name
        #    *value* : 已经缓存的 Admin View 类
        self._admin_view_cache = {}

        self.check_dependencies()

        self.model_admins_order = 0

    def copy_registry(self):
        """
        复制当前 AdminSite 实例的信息
        """
        import copy
        return {
            'models': copy.copy(self._registry),
            'avs': copy.copy(self._registry_avs),
            'views': copy.copy(self._registry_views),
            'settings': copy.copy(self._registry_settings),
            'modelviews': copy.copy(self._registry_modelviews),
            'plugins': copy.copy(self._registry_plugins),
        }

    def restore_registry(self, data):
        """
        恢复当前 AdminSite 实例的信息
        """
        self._registry = data['models']
        self._registry_avs = data['avs']
        self._registry_views = data['views']
        self._registry_settings = data['settings']
        self._registry_modelviews = data['modelviews']
        self._registry_plugins = data['plugins']

    def register_modelview(self, path, admin_view_class, name):
        """
        将 Model Base Admin View 类注册到 AdminSite，

        :param path: view对应的url路径
        :param admin_view_class: 注册的 Model Base Admin View 类
        :param name: view对应的url name, 要包含两个%%s, 分别会替换为 app_label和module_name

        注册 Model Base Admin View 可以为每一个在xadmin注册的 Model 生成一个 Admin View，并且包含相关的 Model 信息。
        具体内容可以参看 :class:`~xadmin.views.base.ModelAdminView`。 举例::

            from xadmin.views import ModelAdminView

            class TestModelAdminView(ModelAdminView):
                
                def get(self, request, obj_id):
                    pass

            site.register_modelview(r'^(.+)/test/$', TestModelAdminView, name='%s_%s_test')

        注册后，用户可以通过访问 ``/%(app_label)s/%(module_name)s/123/test`` 访问到该view
        """
        # 内部引用，避免循环引用
        from xadmin.views.base import BaseAdminView
        if issubclass(admin_view_class, BaseAdminView):
            self._registry_modelviews.append((path, admin_view_class, name))
        else:
            raise ImproperlyConfigured(u'The registered view class %s isn\'t subclass of %s' %
                                      (admin_view_class.__name__, BaseAdminView.__name__))

    def register_view(self, path, admin_view_class, name):
        """
        将 Admin View 类注册到 AdminSite，一般用于创建独立的 admin 页面，例如登陆，介绍页面，帮助页面等。

        :param path: view对应的url路径
        :param admin_view_class: 注册的 Admin View 类
        :param name: view对应的url name

        关于 Admin View 具体内容可以参看 :class:`~xadmin.views.base.BaseAdminView`。 举例::

            from xadmin.views import BaseAdminView

            class TestAdminView(BaseAdminView):
                
                def get(self, request):
                    pass

            site.register_view(r'test_view/$', TestModelAdminView, name='for_test')

        注册后，用户可以通过访问 ``/test_view/`` 访问到该view
        """
        self._registry_views.append((path, admin_view_class, name))

    def register_plugin(self, plugin_class, admin_view_class):
        """
        将 Plugin 类注册到 AdminSite，当任何 Admin View 运行时当前 view 绑定的 plugin 会生效。

        :param plugin_class: view对应的url路径
        :param admin_view_class: 该 plugin 绑定的 Admin View 类

        关于 Admin Plugin 具体内容可以参看 :class:`~xadmin.views.base.BaseAdminPlugin`。 举例::

            from xadmin.views import BaseAdminPlugin

            class TestAdminPlugin(BaseAdminPlugin):
                
                def get_context(self, context):
                    context['test'] = True
                    return context

            site.register_plugin(TestAdminPlugin, SomeAdminView)

        注册后，只要运行 SomeAdminView 实例的 get_context 方法，就会调用该 plugin。
        """
        from xadmin.views.base import BaseAdminPlugin
        if issubclass(plugin_class, BaseAdminPlugin):
            self._registry_plugins.setdefault(
                admin_view_class, []).append(plugin_class)
        else:
            raise ImproperlyConfigured(u'The registered plugin class %s isn\'t subclass of %s' %
                                      (plugin_class.__name__, BaseAdminPlugin.__name__))

    def register_settings(self, name, admin_class):
        self._registry_settings[name.lower()] = admin_class

    def register(self, model_or_iterable, admin_class=object, **options):
        """
        注册需要管理的 Model， 或是注册某 AdminView 的 OptionClass

        :param model_or_iterable: 传入 model 或是指定的 ModelOptionClass
        :param admin_class: 当 model_or_iterable 为 Model 时，该参数为 ModelAdmin；model_or_iterable 为 AdminView 时 ，该参数为 OptionClass

        关于 Admin Plugin 具体内容可以参看 :class:`~xadmin.views.base.BaseAdminPlugin`。 举例::

            from models import SomeModel

            class SomeModelAdmin(object):
                pass

            site.register(SomeModel, SomeModelAdmin)

        """
        from xadmin.views.base import BaseAdminView
        if isinstance(model_or_iterable, ModelBase) or issubclass(model_or_iterable, BaseAdminView):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if isinstance(model, ModelBase):
                if model._meta.abstract:
                    raise ImproperlyConfigured('The model %s is abstract, so it '
                                               'cannot be registered with admin.' % model.__name__)

                if model in self._registry:
                    raise AlreadyRegistered(
                        'The model %s is already registered' % model.__name__)

                # If we got **options then dynamically construct a subclass of
                # admin_class with those **options.
                if options:
                    # For reasons I don't quite understand, without a __module__
                    # the created class appears to "live" in the wrong place,
                    # which causes issues later on.
                    options['__module__'] = __name__

                admin_class = type(str("%s%sAdmin" % (model._meta.app_label, model._meta.module_name)), (admin_class,), options or {})
                admin_class.model = model
                admin_class.order = self.model_admins_order
                self.model_admins_order += 1
                self._registry[model] = admin_class
            else:
                if model in self._registry_avs:
                    raise AlreadyRegistered('The admin_view_class %s is already registered' % model.__name__)
                if options:
                    options['__module__'] = __name__
                    admin_class = type(str(
                        "%sAdmin" % model.__name__), (admin_class,), options)

                self._registry_avs[model] = admin_class

    def unregister(self, model_or_iterable):
        """
        取消 Model 或 OptionClass 的注册

        如果 Model 或 OptionClass 并未注册过，会抛出 :exc:`xadmin.sites.NotRegistered` 异常
        """
        from xadmin.views.base import BaseAdminView
        if isinstance(model_or_iterable, (ModelBase, BaseAdminView)):
            model_or_iterable = [model_or_iterable]
        for model in model_or_iterable:
            if isinstance(model, ModelBase):
                if model not in self._registry:
                    raise NotRegistered(
                        'The model %s is not registered' % model.__name__)
                del self._registry[model]
            else:
                if model not in self._registry_avs:
                    raise NotRegistered('The admin_view_class %s is not registered' % model.__name__)
                del self._registry_avs[model]

    def set_loginview(self, login_view):
        self.login_view = login_view

    def has_permission(self, request):
        """
        如果返回为 ``True`` 则说明 ``request.user`` 至少能够访问当前xadmin网站。否则无法访问xadmin的任何页面。
        """
        return request.user.is_active and request.user.is_staff

    def check_dependencies(self):
        """
        检查运行xadmin需要的包是否已经正确安装

        默认情况下会检查 *ContentType* 模块是否已经正确安装
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
        为当前 ``AdminSite`` 的所有 View 提供的 Decorator。主要是功能是使用 :meth:`AdminSite.has_permission` 
        方法来判断当前用户是否有权限访问该 ``AdminSite``， 如果没有，转到登陆页面

        通常情况下会在 :meth:`AdminSite.get_urls` 方法中使用该方法

        :param cacheable: 默认情况下，所有的 AdminView 会通过 ``never_cache`` 标记成不做缓存，如果确实需要缓存，可以设置 cacheable=True
        """
        def inner(request, *args, **kwargs):
            if not self.has_permission(request) and getattr(view, 'need_site_permission', True):
                return self.create_admin_view(self.login_view)(request, *args, **kwargs)
            return view(request, *args, **kwargs)

        if not cacheable:
            inner = never_cache(inner)
        return update_wrapper(inner, view)

    def _get_merge_attrs(self, option_class, plugin_class):
        """
        从 OptionClass 中获取 plugin 需要的属性。目前是获取 OptionClass 中不以 ``_`` 开头的属性，且该属性在 Plugin 中有定义

        TODO: 处理方式需要考虑优化，目前还是比较山寨
        """
        return dict([(name, getattr(option_class, name)) for name in dir(option_class)
                    if name[0] != '_' and not callable(getattr(option_class, name)) and hasattr(plugin_class, name)])

    def _get_settings_class(self, admin_view_class):
        name = admin_view_class.__name__.lower()

        if name in self._registry_settings:
            return self._registry_settings[name]
        elif name.endswith('admin') and name[0:-5] in self._registry_settings:
            return self._registry_settings[name[0:-5]]
        elif name.endswith('adminview') and name[0:-9] in self._registry_settings:
            return self._registry_settings[name[0:-9]]

        return None

    def _create_plugin(self, option_classes):
        """
        返回创建插件类的方法，用于创建新的、与 OptionClass 合并过的插件类。
        """
        # 创建新插件类的方法
        def merge_class(plugin_class):
            if option_classes:
                attrs = {}
                bases = [plugin_class]
                for oc in option_classes:
                    # 首先根据 OptionClass 获取需要合并的属性 
                    attrs.update(self._get_merge_attrs(oc, plugin_class))
                    # 其次查看 OptionClass 是否含有与插件类同名的 SubClass，有的话也作为 baseclass 合并。
                    meta_class = getattr(oc, plugin_class.__name__, getattr(oc, plugin_class.__name__.replace('Plugin', ''), None))
                    if meta_class:
                        bases.insert(0, meta_class)
                if attrs:
                    # 合并新的插件类
                    plugin_class = MergeAdminMetaclass(
                        '%s%s' % (''.join([oc.__name__ for oc in option_classes]), plugin_class.__name__),
                        tuple(bases), attrs)
            return plugin_class
        return merge_class

    def get_plugins(self, admin_view_class, *option_classes):
        """
        xadmin中 **核心** 方法，用于获取 AdminViewClass 的 plugins。

        获取 plugins 首先根据该 AdminViewClass 及其所有的集成类在已经注册的插件中找到相应的插件类。然后再使用第二个参数的 OptionClass 拼成插件类。
        """
        from xadmin.views import BaseAdminView
        plugins = []
        opts = [oc for oc in option_classes if oc]
        for klass in admin_view_class.mro():
            # 列出 AdminViewClass 所有的集成类
            if klass == BaseAdminView or issubclass(klass, BaseAdminView):
                merge_opts = []
                reg_class = self._registry_avs.get(klass)
                if reg_class:
                    merge_opts.append(reg_class)
                settings_class = self._get_settings_class(klass)
                if settings_class:
                    merge_opts.append(settings_class)
                merge_opts.extend(opts)
                ps = self._registry_plugins.get(klass, [])
                # 如果有需要merge的 OptionClass 则使用 AdminSite._create_plugin 方法创建插件类，并且放入插件列表
                plugins.extend(map(self._create_plugin(
                    merge_opts), ps) if merge_opts else ps)
        return plugins

    def get_view_class(self, view_class, option_class=None, **opts):
        """
        xadmin中 **最核心** 的方法，用于创建 xadmin 特有的 AdminViewClass。

        创建 AdminView 和核心思想为动态生成 mix 的类，主要步骤有两步:

            1. 使用已经注册的 OptionClass (见 :meth:`~register`) 以及参数传入的 option_class 与 view_class 动态生成类
            2. 根据 view_class 及其继承类找到相应的 plugins， 作为生成的 AdminViewClass 的 plugins 属性

        """
        merges = [option_class] if option_class else []
        for klass in view_class.mro():
            # 找到该 view_class 所有基类在 AdminSite 注册的 OptionClass
            reg_class = self._registry_avs.get(klass)
            if reg_class:
                merges.append(reg_class)
            settings_class = self._get_settings_class(klass)
            if settings_class:
                merges.append(settings_class)
            merges.append(klass)
        new_class_name = ''.join([c.__name__ for c in merges])

        if new_class_name not in self._admin_view_cache:
            # 如果缓存中没有该类，则创建这个类。首先取得该 view_class 的 plugins
            plugins = self.get_plugins(view_class, option_class)
            # 合成新类，同时吧 plugins 及 admin_site 作为类属性传入
            self._admin_view_cache[new_class_name] = MergeAdminMetaclass(
                new_class_name, tuple(merges),
                dict({'plugin_classes': plugins, 'admin_site': self}, **opts))

        return self._admin_view_cache[new_class_name]

    def create_admin_view(self, admin_view_class):
        """
        使用 :meth:`~AdminSite.get_view_class` 创建 AdminView 类，并且返回 view 方法，可以用于 get_urls 方法中

        :param admin_view_class: AdminView 类
        """
        return self.get_view_class(admin_view_class).as_view()

    def create_model_admin_view(self, admin_view_class, model, option_class):
        """
        使用 :meth:`~AdminSite.get_view_class` 创建 ModelAdminView 类，并且返回 view 方法，可以用于 get_urls 方法中

        :param admin_view_class: AdminView 类，该类应该为 :class:`~xadmin.views.base.ModelAdminView` 的子类
        :param model: Model 类，目前该参数暂无作用
        :param option_class: Model 的 OptionClass，保存对该 Model 的相关定制
        """
        return self.get_view_class(admin_view_class, option_class).as_view()

    def get_urls(self):
        from django.conf.urls import patterns, url, include
        from xadmin.views.base import BaseAdminView

        if settings.DEBUG:
            # 如果是DEBUG模式，检查依赖
            self.check_dependencies()

        #: 该方法主要用来使用 AdminSite.admin_view 封装 view
        def wrap(view, cacheable=False):
            def wrapper(*args, **kwargs):
                return self.admin_view(view, cacheable)(*args, **kwargs)
            return update_wrapper(wrapper, view)

        # 添加 i18n_javascript view， 用于js的国际化
        urlpatterns = patterns('',
                               url(r'^jsi18n/$', wrap(self.i18n_javascript,
                                                      cacheable=True), name='jsi18n')
                               )

        # 添加注册的 AdminViewClass
        urlpatterns += patterns('',
                                *[url(
                                  path, wrap(self.create_admin_view(clz_or_func)) if type(clz_or_func) == type and issubclass(clz_or_func, BaseAdminView) else include(clz_or_func(self)),
                                  name=name) for path, clz_or_func, name in self._registry_views]
                                )

        # 添加 ModelAdminViewClass
        for model, admin_class in self._registry.iteritems():
            # 需要将所有已经注册的 Model 逐一注册 ModelAdminViewClass
            view_urls = [url(
                path, wrap(
                    self.create_model_admin_view(clz, model, admin_class)),
                name=name % (model._meta.app_label, model._meta.module_name))
                for path, clz, name in self._registry_modelviews]
            urlpatterns += patterns('',
                                    url(
                                    r'^%s/%s/' % (
                                        model._meta.app_label, model._meta.module_name),
                                    include(patterns('', *view_urls)))
                                    )

        return urlpatterns

    @property
    def urls(self):
        """
        返回 xadmin site 的urls，用于设置django的urls。该方法用于属性使用。在您的Django的 ``urls.py`` 中，使用示例如下::

            from django.conf.urls import patterns, include, url

            import xadmin
            xadmin.autodiscover()

            urlpatterns = patterns('',
                url(r'', include(xadmin.site.urls)),
            )

        """
        return self.get_urls(), self.name, self.app_name

    def i18n_javascript(self, request):
        if settings.USE_I18N:
            from django.views.i18n import javascript_catalog
        else:
            from django.views.i18n import null_javascript_catalog as javascript_catalog
        return javascript_catalog(request, packages=['django.conf', 'xadmin'])

# :class:`AdminSite` 的单例，通常情况下可以直接使用这个 site，作为全站统一实例
site = AdminSite()
