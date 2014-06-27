# coding=utf-8
import sys
import copy
import functools
import datetime
import decimal
from functools import update_wrapper
from inspect import getargspec

from django import forms
from django.utils.encoding import force_unicode
from django.conf import settings
from django.contrib import messages
from django.core.exceptions import ValidationError
from django.core.serializers.json import DjangoJSONEncoder
from django.core.urlresolvers import reverse
from django.http import HttpResponse
from django.template import Context, Template
from django.template.response import TemplateResponse
from django.utils.datastructures import SortedDict
from django.utils.decorators import method_decorator, classonlymethod
from django.utils.encoding import smart_unicode
from django.utils.http import urlencode
from django.utils.itercompat import is_iterable
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_protect
from django.views.generic import View
from xadmin.util import static, json, vendor, sortkeypicker

#: 通用的csrf_protect_m装饰器，给其他模块的 AdminView 使用
csrf_protect_m = method_decorator(csrf_protect)


class IncorrectPluginArg(Exception):
    """ 当插件的方法参数错误时抛出该异常 """
    pass


def filter_chain(filters, token, func, *args, **kwargs):
    if token == -1:
        return func()
    else:
        def _inner_method():
            fm = filters[token]
            fargs = getargspec(fm)[0]
            if len(fargs) == 1:
                # 只有 self 一个参数，这时如果 AdminView 方法的执行结果是 None 则没有问题，否则会抛出异常
                result = func()
                if result is None:
                    return fm()
                else:
                    raise IncorrectPluginArg(u'Plugin filter method need a arg to receive parent method result.')
            else:
                # 如果第一个参数为 ``__`` ，传入的参数为 func， 而非 func()
                return fm(func if fargs[1] == '__' else func(), *args, **kwargs)
        return filter_chain(filters, token - 1, _inner_method, *args, **kwargs)


def filter_hook(func):
    """
    表明 AdminView 的方法可以被插件插入的装饰器。执行使用了该装饰器的方法时，会按照以下过程执行:

        1. 首先将实例的 plugins 属性取出，取出含有同样方法名的插件

        2. 按照插件方法的 ``priority`` 属性排序

        3. 顺序执行插件方法，执行插件方法的规则:

            * 如果插件方法没有参数，AdminView 方法的返回结果不为空则抛出异常

            * 如果插件方法的第一个参数为 ``__`` ，则 AdminView 方法将作为第一个参数传入，注意，这时还未执行该方法，
              在插件中可以通过 ``__()`` 执行，这样就可以实现插件在 AdminView 方法执行前实现一些自己的逻辑，例如::

                def get_context(self, __):
                    c = {'key': 'value'}
                    c.update(__())
                    return c

            * 如果插件方法的第一个参数不为 ``__`` ，则执行 AdminView 方法，将结果作为第一个参数传入

        4. 最终将插件顺序执行的结果返回

    """
    tag = func.__name__
    func.__doc__ = "``filter_hook``\n\n" + (func.__doc__ or "")

    @functools.wraps(func)
    def method(self, *args, **kwargs):

        # 将 AdminView 的方法先封装起来，方便后面执行
        def _inner_method():
            return func(self, *args, **kwargs)

        if self.plugins:
            # 首先取出所有含有同名方法的插件
            filters = [(getattr(getattr(p, tag), 'priority', 10), getattr(p, tag))
                       for p in self.plugins if callable(getattr(p, tag, None))]
            # 按照 ``priority`` 属性排序
            filters = [f for p, f in sorted(filters, key=lambda x:x[0])]
            return filter_chain(filters, len(filters) - 1, _inner_method, *args, **kwargs)
        else:
            return _inner_method()
    return method


def inclusion_tag(file_name, context_class=Context, takes_context=False):
    """
    为 AdminView 的 block views 提供的便利方法，作用等同于 :meth:`django.template.Library.inclusion_tag`
    """
    def wrap(func):
        @functools.wraps(func)
        def method(self, context, nodes, *arg, **kwargs):
            _dict = func(self, context, nodes, *arg, **kwargs)
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
            # 添加 admin_view
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


class BaseAdminObject(object):
    """
    提供给 :class:`BaseAdminView` 和 :class:`BaseAdminPlugin` 的通用基类，主要是提供了一些常用的通用方法
    """
    def get_view(self, view_class, option_class=None, *args, **kwargs):
        """
        获取 AdminViewClass 的实例。实际上就是调用 :meth:`~xadmin.sites.AdminSite.get_view_class` 方法

        :param view_class: AdminViewClass 的类
        :param option_class: 希望与 AdminViewClass 合并的 OptionClass
        """
        opts = kwargs.pop('opts', {})
        return self.admin_site.get_view_class(view_class, option_class, **opts)(self.request, *args, **kwargs)

    def get_model_view(self, view_class, model, *args, **kwargs):
        """
        获取 ModelAdminViewClass 的实例。首先通过 :class:`~xadmin.sites.AdminSite` 取得 model 对应的 OptionClass，然后调用 :meth:`get_view` 方法

        :param view_class: ModelAdminViewClass 的类
        :param model: 绑定的 Model 类
        """
        return self.get_view(view_class, self.admin_site._registry.get(model), *args, **kwargs)

    def get_admin_url(self, name, *args, **kwargs):
        """
        便捷方法，方便的通过 name 取得 url，会加上 AdminSite.app_name 的 url namespace
        """
        return reverse('%s:%s' % (self.admin_site.app_name, name), args=args, kwargs=kwargs)

    def get_model_url(self, model, name, *args, **kwargs):
        """
        便捷方法，方便的通过 model, name 取得 url，会自动拼成 urlname，并会加上 AdminSite.app_name 的 url namespace
        """
        return reverse(
            '%s:%s_%s_%s' % (self.admin_site.app_name, model._meta.app_label,
                             model._meta.module_name, name),
            args=args, kwargs=kwargs, current_app=self.admin_site.name)

    def get_model_perm(self, model, name):
        """
        获取 Model 的某种权限标签，标签的格式为::

            >>> view.get_model_perm(User, 'view')
            >>> 'auth.user_view'
        """
        return '%s.%s_%s' % (model._meta.app_label, name, model._meta.module_name)

    def has_model_perm(self, model, name, user=None):
        """
        判断当前用户是否有某个 Model 的 某种权限，例如:

            >>> view.has_model_perm(User, 'view')
            >>> True
        """
        user = user or self.user
        return user.has_perm(self.get_model_perm(model, name)) or (name == 'view' and self.has_model_perm(model, 'change', user))

    def get_query_string(self, new_params=None, remove=None):
        """
        在当前的query_string基础上生成新的query_string

        :param new_params: 要新加的参数，该参数为 dict 
        :param remove: 要删除的参数，该参数为 list, tuple
        """
        if new_params is None:
            new_params = {}
        if remove is None:
            remove = []
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
        """
        将当前 request 的参数，新加或是删除后，生成 hidden input。用于放入 HTML 的 Form 中。

        :param new_params: 要新加的参数，该参数为 dict 
        :param remove: 要删除的参数，该参数为 list, tuple
        """
        if new_params is None:
            new_params = {}
        if remove is None:
            remove = []
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
            '<input type="hidden" name="%s" value="%s"/>' % (k, v) for k, v in p.items() if v))

    def render_response(self, content, response_type='json'):
        """
        便捷方法，方便生成 HttpResponse，如果 response_type 为 ``json`` 会自动转为 json 格式后输出
        """
        if response_type == 'json':
            response = HttpResponse(mimetype="application/json; charset=UTF-8")
            response.write(
                json.dumps(content, cls=JSONEncoder, ensure_ascii=False))
            return response
        return HttpResponse(content)

    def template_response(self, template, context):
        """
        便捷方法，方便生成 TemplateResponse
        """
        return TemplateResponse(self.request, template, context, current_app=self.admin_site.name)

    def message_user(self, message, level='info'):
        """
        Send a message to the user. The default implementation
        posts a message using the django.contrib.messages backend.
        """
        if hasattr(messages, level) and callable(getattr(messages, level)):
            getattr(messages, level)(self.request, message)

    def static(self, path):
        """
        :meth:`xadmin.util.static` 的快捷方法，返回静态文件的 url。
        """
        return static(path)

    def vendor(self, *tags):
        return vendor(*tags)


class BaseAdminPlugin(BaseAdminObject):
    """
    所有 Plugin 的基类。继承于 :class:`BaseAdminObject` 。插件的注册和使用可以参看 :meth:`xadmin.sites.AdminSite.register_plugin` ，
    插件的原理可以参看 :func:`filter_hook` :

    .. autofunction:: xadmin.views.base.filter_hook
    """
    def __init__(self, admin_view):
        self.admin_view = admin_view
        self.admin_site = admin_view.admin_site

        if hasattr(admin_view, 'model'):
            self.model = admin_view.model
            self.opts = admin_view.model._meta

    def init_request(self, *args, **kwargs):
        """
        插件的初始化方法，Plugin 实例化后被调用的第一个方法。该方法主要用于初始化插件需要的属性，
        同时判断当前请求是否需要加载该插件，例如 Ajax插件的实现方式::

            def init_request(self, *args, **kwargs):
                return bool(self.request.is_ajax() or self.request.REQUEST.get('_ajax'))

        当返回值为 ``False`` 时，所属的 AdminView 实例不会加载该插件
        """
        pass


class BaseAdminView(BaseAdminObject, View):
    """
    所有 AdminView 的基类。继承于 :class:`BaseAdminObject` 和 :class:`django.views.generic.View`

    该类是 xadmin 中 **最核心** 的类，所有的 AdminView 都需要继承此类。xadmin 与 Django Admin最大的区别就在于 xadmin 
    每次请求会产生一个 AdminView 的实例，也就是基于 Class 的 view 方式。该方式在 Django 1.3 被实现，可以参看 Django 的官方文档
    `Class-based generic views <https://docs.djangoproject.com/en/1.4/topics/class-based-views/>`_

    使用 Class 的方式实现的好处显而易见。首先，每一次请求都会产生一个新的实例，这样 request 这种变量就可以保存在实例中，基类的扩展，或
    是复写父类方法时再也不用带着 request 到处跑了，当然，除了 request 还有很多可以基于实例存储的变量。

    其次，基于实例的方式非常方便的实现了插件功能，而且还能实现插件的动态加载，因为每个 AdminView 实例可以根据自身实例的属性情况来判断加载
    哪些插件，具体信息也可以参看 :class:`BaseAdminPlugin` 的描述。

    实现一个自己的 AdminView 类很简单，举例如下::

        from xadmin.sites import site
        from xadmin.views import BaseAdminView

        class MyAdminView(BaseAdminView):

            def get(self, request, *args, **kwargs):
                pass

        site.register_view(r'^me_test/$', MyAdminView, name='my_test')

    而后您就可以在 ``me_test/`` 访问到该view了。当然xadmin同事提供了一些通用的 AdminView，分别为

        * :class:`CommAdminView` : xadmin通用界面的基础View，提供了xadmin通用界面需要的一些数据(菜单等)
        * :class:`ModelAdminView` : 核心类之一，提供了基于 Model 的 AdminView。
    """

    base_template = 'xadmin/base.html'
    need_site_permission = True

    def __init__(self, request, *args, **kwargs):
        self.request = request
        self.request_method = request.method.lower()
        self.user = request.user

        self.base_plugins = [p(self) for p in getattr(self,
                                                      "plugin_classes", [])]

        self.args = args
        self.kwargs = kwargs
        self.init_plugin(*args, **kwargs)
        self.init_request(*args, **kwargs)

    @classonlymethod
    def as_view(cls):
        """
        复写了 :meth:`View.as_view` 方法，主要是将 :meth:`View.dispatch` 的也写到了本方法中，并且去掉了一些初始化操作，
        因为这些初始化操作在 AdminView 的初始化方法中已经完成了，可以参看 :meth:`BaseAdminView.init_request`
        """
        def view(request, *args, **kwargs):
            self = cls(request, *args, **kwargs)

            if hasattr(self, 'get') and not hasattr(self, 'head'):
                self.head = self.get

            if self.request_method in self.http_method_names:
                handler = getattr(
                    self, self.request_method, self.http_method_not_allowed)
            else:
                handler = self.http_method_not_allowed

            return handler(request, *args, **kwargs)

        update_wrapper(view, cls, updated=())
        view.need_site_permission = cls.need_site_permission

        return view

    def init_request(self, *args, **kwargs):
        """
        一般用于子类复写的初始化方法，在 AdminView 实例化时调用，:class:`BaseAdminView` 的该方法不做任何操作。
        """
        pass

    def init_plugin(self, *args, **kwargs):
        """
        AdminView 实例中插件的初始化方法，在 :meth:`BaseAdminView.init_request` 后调用。根据 AdminView 中
        的 base_plugins 属性将插件逐一初始化，既调用 :meth:`BaseAdminPlugin.init_request` 方法，并根据返回结果判断是否加载该插件。
        最后该方法会将初始化后的插件设置为 plugins 属性。
        """
        plugins = []
        for p in self.base_plugins:
            p.request = self.request
            p.user = self.user
            p.args = self.args
            p.kwargs = self.kwargs
            result = p.init_request(*args, **kwargs)
            if result is not False:
                # 返回结果不为 `False` 就加载该插件
                plugins.append(p)
        self.plugins = plugins

    @filter_hook
    def get_context(self):
        """
        返回显示页面所需的 context 对象。
        """
        return {'admin_view': self, 'media': self.media, 'base_template': self.base_template}

    @property
    def media(self):
        return self.get_media()

    @filter_hook
    def get_media(self):
        """
        取得页面所需的 Media 对象，用于生成 css 和 js 文件
        """
        return forms.Media()


class CommAdminView(BaseAdminView):
    """
    基于 :class:`BaseAdminView` 提供的通用 AdminView。主要是完成了一些 xadmin 页面通用内容的处理。主要有:

        * 网站标题
        * 全局的 Model 图标
        * 网站菜单
 
    **View属性**:
 
        .. autoattribute:: site_title
        .. autoattribute:: site_footer
        .. autoattribute:: global_models_icon
        .. autoattribute:: base_template
        .. autoattribute:: default_model_icon
    """

    base_template = 'xadmin/base_site.html'    #: View模板继承的基础模板
    menu_template = 'xadmin/includes/sitemenu_default.html'

    site_title = None         #: 网站的标题
    site_footer = None         #: 网站的下角标文字
    #: 全局的 Model 图标::
    #:
    #:     globe_models_icon = {User: 'user-icon'}
    global_models_icon = {}
    default_model_icon = None
    apps_label_title = {}
    apps_icons = {}

    def get_site_menu(self):
        """``FAQ:如何定制系统菜单``\n
        用于给子类复写的方法，开发者可以在子类或 OptionClass 中复写该方法，返回自己定义的网站菜单。菜单的格式为::

            ({
                "title": "菜单标题", "perm": "权限标示", 
                "icon": "图标的 css class", "url": "菜单url", 
                "menus": [...]    # 子菜单项
            })

        菜单项的 ``perm`` 和 ``url`` 如果是基于 Model 的，可以使用 xadmin 提供的便利方法 
        :meth:`BaseAdminObject.get_model_perm` 和 :meth:`BaseAdminObject.get_model_url`。举例说明创建菜单::

            class AdminSettings(object):

                def get_site_menu(self):
                    return (
                        {'title': '内容管理', 'perm': self.get_model_perm(Article, 'change'), 'menus':(
                            {'title': '游戏资料', 'icon': 'info-sign', 'url': self.get_model_url(Article, 'changelist') + '?_rel_categories__id__exact=2'},
                            {'title': '网站文章', 'icon': 'file', 'url': self.get_model_url(Article, 'changelist') + '?_rel_categories__id__exact=1'},
                        )},
                        {'title': '分类管理', 'perm': self.get_model_perm(Category, 'change'), 'menus':(
                            {'title': '主要分类', 'url': self.get_model_url(Category, 'changelist') + '?_p_parent__isnull=True'},
                            {'title': '游戏资料', 'url': self.get_model_url(Category, 'changelist') + '?_rel_parent__id__exact=2'},
                        )},
                    )

            site.register(CommAdminView, AdminSettings)

        """
        return None

    @filter_hook
    def get_nav_menu(self):
        """
        返回网站菜单，如果 :meth:`get_site_menu` 返回的结果不是 None ，那么将把其返回结果作为菜单的第一部分，而后会补全没有出现的 Model 列表页菜单项，
        如果 :meth:`get_site_menu` 返回为 None， 那么将自动根据 App 和 Model 生成两级的菜单。

        :rtype: 格式见 :meth:`get_site_menu` 返回格式
        """
        site_menu = list(self.get_site_menu() or [])
        had_urls = []

        # 选出所有已经存在的菜单项的 URL，后期自动生成菜单时会排除这些项。
        def get_url(menu, had_urls):
            if 'url' in menu:
                had_urls.append(menu['url'])
            if 'menus' in menu:
                for m in menu['menus']:
                    get_url(m, had_urls)
        get_url({'menus': site_menu}, had_urls)

        nav_menu = SortedDict()    #使用有序 dict，保证每次生成的菜单顺序固定

        for model, model_admin in self.admin_site._registry.items():
            if getattr(model_admin, 'hidden_menu', False):
                continue
            app_label = model._meta.app_label
            app_icon = None
            model_dict = {
                'title': unicode(capfirst(model._meta.verbose_name_plural)),
                'url': self.get_model_url(model, "changelist"),
                'icon': self.get_model_icon(model),
                'perm': self.get_model_perm(model, 'view'),
                'order': model_admin.order,
            }
            if model_dict['url'] in had_urls:
                # 过如该url已经在之前的菜单项中存在，就跳过该项
                continue

            app_key = "app:%s" % app_label
            if app_key in nav_menu:
                nav_menu[app_key]['menus'].append(model_dict)
            else:
                # Find app title
                app_title = unicode(app_label.title())
                if app_label.lower() in self.apps_label_title:
                    app_title = self.apps_label_title[app_label.lower()]
                else:
                    mods = model.__module__.split('.')
                    if len(mods) > 1:
                        mod = '.'.join(mods[0:-1])
                        if mod in sys.modules:
                            mod = sys.modules[mod]
                            if 'verbose_name' in dir(mod):
                                app_title = getattr(mod, 'verbose_name')
                            elif 'app_title' in dir(mod):
                                app_title = getattr(mod, 'app_title')
                #find app icon
                if app_label.lower() in self.apps_icons:
                    app_icon = self.apps_icons[app_label.lower()]

                nav_menu[app_key] = {
                    'title': app_title,
                    'menus': [model_dict],
                }

            app_menu = nav_menu[app_key]
            if app_icon:
                app_menu['first_icon'] = app_icon
            elif ('first_icon' not in app_menu or
                    app_menu['first_icon'] == self.default_model_icon) and model_dict.get('icon'):
                app_menu['first_icon'] = model_dict['icon']

            if 'first_url' not in app_menu and model_dict.get('url'):
                app_menu['first_url'] = model_dict['url']

        for menu in nav_menu.values():
            menu['menus'].sort(key=sortkeypicker(['order', 'title']))

        nav_menu = nav_menu.values()
        nav_menu.sort(key=lambda x: x['title'])

        site_menu.extend(nav_menu)

        return site_menu

    @filter_hook
    def get_context(self):
        """
        **Context Params** :

            ``site_title`` : 使用 :attr:`site_title` 属性，默认为 "Django Xadmin"

            ``nav_menu`` : 权限过滤后的系统菜单项，如果在非 DEBUG 模式，该项会缓存在 SESSION 中
        """
        context = super(CommAdminView, self).get_context()

        # DEBUG模式会首先尝试从SESSION中取得缓存的菜单项
        if not settings.DEBUG and 'nav_menu' in self.request.session:
            nav_menu = json.loads(self.request.session['nav_menu'])
        else:
            menus = copy.copy(self.get_nav_menu())

            def check_menu_permission(item):
                need_perm = item.pop('perm', None)
                if need_perm is None:
                    return True
                elif callable(need_perm):
                    return need_perm(self.user)
                elif need_perm == 'super':    # perm项如果为 ``super`` 说明需要超级用户权限
                    return self.user.is_superuser
                else:
                    return self.user.has_perm(need_perm)

            def filter_item(item):
                if 'menus' in item:
                    before_filter_length = len(item['menus'])
                    item['menus'] = [filter_item(
                        i) for i in item['menus'] if check_menu_permission(i)]
                    after_filter_length = len(item['menus'])
                    if after_filter_length == 0 and before_filter_length > 0:
                        return None
                return item

            nav_menu = [filter_item(item) for item in menus if check_menu_permission(item)]
            nav_menu = filter(lambda x:x, nav_menu)

            if not settings.DEBUG:
                self.request.session['nav_menu'] = json.dumps(nav_menu)
                self.request.session.modified = True

        def check_selected(menu, path):
            # 判断菜单项是否被选择，使用当前url跟菜单项url对比
            selected = False
            if 'url' in menu:
                chop_index = menu['url'].find('?')
                if chop_index == -1:
                    selected = path.startswith(menu['url'])
                else:
                    selected = path.startswith(menu['url'][:chop_index])
            if 'menus' in menu:
                for m in menu['menus']:
                    _s = check_selected(m, path)
                    if _s:
                        selected = True
            if selected:
                menu['selected'] = True
            return selected
        for menu in nav_menu:
            check_selected(menu, self.request.path)

        context.update({
            'menu_template': self.menu_template,
            'nav_menu': nav_menu,
            'site_title': self.site_title or _(u'Django Xadmin'),
            'site_footer': self.site_footer or _(u'my-company.inc 2013'),
            'breadcrumbs': self.get_breadcrumb()
        })

        return context

    @filter_hook
    def get_model_icon(self, model):
        """
        取得 Model 图标，Model 图标会作为 css class，一般生成 HTML 如下::

            <i class="icon-model icon-{{model_icon}}"></i>

        这是 Bootstrap 标准的图标格式，xadmin 目前是用了 Font Icon (Font-Awesome)，您可以制作自己的图标，具体信息可以参考
        `如何制作自己的字体图标 <http://fortawesome.github.com/Font-Awesome/#contribute>`_

        .. note::

            Model 图标，目前被使用在以下几个地方，当然您也可以随时使用在自己实现的页面中:

                * 系统菜单
                * 列表页面标题中
                * 添加、修改及删除页面的标题中

        ``FAQ: 如果定义 Model 图标``

        您可以在 :class:`CommAdminView` 的 OptionClass 中通过 :attr:`CommAdminView.globe_models_icon` 属性设定全局的 Model 图标。
        或者在 Model 的 OptionClass 中设置 :attr:`model_icon` 属性。
        """
        # 首先从全局图标中获取
        icon = self.global_models_icon.get(model)
        if icon is None and model in self.admin_site._registry:
            # 如果 Model 的 OptionClass 中有 model_icon 属性，则使用该属性
            icon = getattr(self.admin_site._registry[model],
                           'model_icon', self.default_model_icon)
        return icon

    @filter_hook
    def get_breadcrumb(self):
        return [{
            'url': self.get_admin_url('index'),
            'title': _('Home')
            }]

class ModelAdminView(CommAdminView):
    """
    基于 Model 的 AdminView，该类的子类，在 AdminSite 生成 urls 时，会为每一个注册的 Model 生成一个 url 映射。
    ModelAdminView 注册时使用 :meth:`xadmin.sites.AdminSite.register_modelview` 方法注册，具体使用实例可以参见该方法的说明，或参考实例::

        from xadmin.views import ModelAdminView

        class TestModelAdminView(ModelAdminView):
            
            def get(self, request, obj_id):
                pass

        site.register_modelview(r'^(.+)/test/$', TestModelAdminView, name='%s_%s_test')

    注册后，用户可以通过访问 ``/%(app_label)s/%(module_name)s/123/test`` 访问到该view

    **Option 属性**

        .. autoattribute:: fields
        .. autoattribute:: exclude
        .. autoattribute:: ordering
        .. autoattribute:: model

    **实例属性**

        .. py:attribute:: opts

            即 Model._meta

        .. py:attribute:: app_label

            即 Model._meta.app_label

        .. py:attribute:: module_name

            即 Model._meta.module_name

        .. py:attribute:: model_info

            即 (self.app_label, self.module_name)

    """
    fields = None    #: (list,tuple) 默认显示的字段
    exclude = None   #: (list,tuple) 排除的字段，主要用在编辑页面
    ordering = None  #: (dict) 获取 Model 的 queryset 时默认的排序规则
    model = None     #: 绑定的 Model 类，在注册 Model 时，该项会自动附在 OptionClass 中，见方法 :meth:`AdminSite.register`
    remove_permissions = []

    def __init__(self, request, *args, **kwargs):
        #: 即 Model._meta
        self.opts = self.model._meta
        #: 即 Model._meta.app_label
        self.app_label = self.model._meta.app_label
        #: 即 Model._meta.module_name
        self.module_name = self.model._meta.module_name
        #: 即 (self.app_label, self.module_name)
        self.model_info = (self.app_label, self.module_name)

        super(ModelAdminView, self).__init__(request, *args, **kwargs)

    @filter_hook
    def get_context(self):
        """
        **Context Params** :

            ``opts`` : Model 的 _meta

            ``app_label`` : Model 的 app_label

            ``module_name`` : Model 的 module_name

            ``verbose_name`` : Model 的 verbose_name
        """
        new_context = {
            "opts": self.opts,
            "app_label": self.app_label,
            "module_name": self.module_name,
            "verbose_name": force_unicode(self.opts.verbose_name),
            'model_icon': self.get_model_icon(self.model),
        }
        context = super(ModelAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_breadcrumb(self):
        bcs = super(ModelAdminView, self).get_breadcrumb()
        item = {'title': self.opts.verbose_name_plural}
        if self.has_view_permission():
            item['url'] = self.model_admin_url('changelist')
        bcs.append(item)
        return bcs

    @filter_hook
    def get_object(self, object_id):
        """
        根据 object_id 获得唯一的 Model 实例，如果 pk 为 object_id 的 Model 不存在，则返回 None
        """
        queryset = self.queryset()
        model = queryset.model
        try:
            object_id = model._meta.pk.to_python(object_id)
            return queryset.get(pk=object_id)
        except (model.DoesNotExist, ValidationError):
            return None

    @filter_hook
    def get_object_url(self, obj):
        if self.has_change_permission(obj):
            return self.model_admin_url("change", getattr(obj, self.opts.pk.attname))
        elif self.has_view_permission(obj):
            return self.model_admin_url("detail", getattr(obj, self.opts.pk.attname))
        else:
            return None

    def model_admin_url(self, name, *args, **kwargs):
        """
        等同于 :meth:`BaseAdminObject.get_admin_url` ，只是无需填写 model 参数， 使用本身的 :attr:`ModelAdminView.model` 属性。
        """
        return reverse(
            "%s:%s_%s_%s" % (self.admin_site.app_name, self.opts.app_label,
            self.module_name, name), args=args, kwargs=kwargs)

    def get_model_perms(self):
        """
        返回包含 Model 所有权限的 dict。dict 的 key 值为： ``add`` ``view`` ``change`` ``delete`` ， 
        value 为 boolean 值，表示当前用户是否具有相应的权限。
        """
        return {
            'view': self.has_view_permission(),
            'add': self.has_add_permission(),
            'change': self.has_change_permission(),
            'delete': self.has_delete_permission(),
        }

    def get_template_list(self, template_name):
        """
        根据 template_name 返回一个 templates 列表，生成页面是在这些列表中寻找存在的模板。这样，您就能方便的复写某些模板。列表的格式为::

            "xadmin/%s/%s/%s" % (opts.app_label, opts.object_name.lower(), template_name),
            "xadmin/%s/%s" % (opts.app_label, template_name),
            "xadmin/%s" % template_name,

        """
        opts = self.opts
        return (
            "xadmin/%s/%s/%s" % (
                opts.app_label, opts.object_name.lower(), template_name),
            "xadmin/%s/%s" % (opts.app_label, template_name),
            "xadmin/%s" % template_name,
        )

    def get_ordering(self):
        """
        返回 Model 列表的 ordering， 默认就是返回 :attr:`ModelAdminView.ordering` ，子类可以复写该方法
        """
        return self.ordering or ()
        
    def queryset(self):
        """
        返回 Model 的 queryset。可以使用该属性查询 Model 数据。
        """
        return self.model._default_manager.get_query_set()

    def has_view_permission(self, obj=None):
        """
        返回当前用户是否有查看权限

        .. note::

            目前的实现为：如果一个用户有对数据的修改权限，那么他就有对数据的查看权限。当然您可以在子类中修改这一规则
        """
        return ('view' not in self.remove_permissions) and (self.user.has_perm('%s.view_%s' % self.model_info) or \
            self.user.has_perm('%s.change_%s' % self.model_info))

    def has_add_permission(self):
        """
        返回当前用户是否有添加权限
        """
        return ('add' not in self.remove_permissions) and self.user.has_perm('%s.add_%s' % self.model_info)

    def has_change_permission(self, obj=None):
        """
        返回当前用户是否有修改权限
        """
        return ('change' not in self.remove_permissions) and self.user.has_perm('%s.change_%s' % self.model_info)

    def has_delete_permission(self, obj=None):
        """
        返回当前用户是否有删除权限
        """
        return ('delete' not in self.remove_permissions) and self.user.has_perm('%s.delete_%s' % self.model_info)

