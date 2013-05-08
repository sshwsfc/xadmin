.. |xadmin| replace:: Xadmin

.. _make_plugin:

|xadmin| 插件制作
======================

插件原理
---------

|xadmin| 的插件系统架构设计一定程度上借鉴了 ``wordpress`` 的设计。 想要了解 |xadmin| 的插件系统架构首先需要了解 |xadmin| ``AdminView`` 的概念。
简单来说，就是 |xadmin| 系统中每一个页面都是一个 ``AdminView`` 对象返回的 ``HttpResponse`` 结果。|xadmin| 的插件系统做的事情其实就是在 ``AdminView``
运行过程中改变其执行的逻辑， 或是改变其返回的结果，起到修改或增强原有功能的效果。下面让我们看看整个插件从制作完成到实际运行的整个过程。

首先需要创建自己的插件类， 插件类继承 :class:`~xadmin.views.BaseAdminPlugin` ::
    
    class HelloWorldPlugin(BaseAdminPlugin):
        ...

开发好的插件首先要注册到 |xadmin| 中， 示例代码如下::
    
    # ListAdminView 是 Model 列表页面
    xadmin.site.register_plugin(HelloWorldPlugin, ListAdminView)
    
其中插件的注册和使用可以参看 :meth:`xadmin.sites.AdminSite.register_plugin`


当将插件注册到 |xadmin| 后， |xadmin| 在创建 ``AdminView`` 实例的时候会将该插件放入实例的 :attr:`plugins` 属性。当 ``AdminView`` 在处理请求
时，会首先逐个调用 :attr:`plugins` 中插件的 :meth:`~xadmin.views.BaseAdminPlugin.init_request` 方法，插件在该方法中一般进行初始化的操作并且返回一个 Boolean 值告诉 ``AdminView``
是否需要加载该插件。当 :meth:`~xadmin.views.BaseAdminPlugin.init_request` 方法返回值为 ``False`` 时， ``AdminView`` 不会加载该插件。实例如下::
    
    class HelloWorldPlugin(BaseAdminPlugin):
        say_hello = False
        # 初始化方法根据 ``say_hello`` 属性值返回
        def init_request(self, *args, **kwargs):
            return bool(self.say_hello)

在以上实例中，插件根据自身的 ``say_hello`` 属性来决定是否让自己被加载。您可能会迷惑， ``say_hello`` 属性看起来一直会是 ``False`` 呀，那样这个插件不是永远不会被加载？
其实 |xadmin| 在创建插件实例的时候会将 ``OptionClass`` 的同名属性替换插件的属性。这样，在不同的 ``OptionClass`` 下会有不同的插件结果，实例如下::
    
    class SomeModelAdmin(object):
        say_hello = True
        ...
    site.register(SomeModel, SomeModelAdmin)

理解以上内容后，让我们再看看插件具体是如何起作用的。在 ``AdminView`` 的执行过程中，可以被插件截获或修改的方法使用 :func:`~xadmin.views.base.filter_hook` 装饰，实例如下::

    class ListAdminView(ModelAdminView):
        # 可以被插件截获或修改的方法使用该装饰器装饰
        @filter_hook
        def get_context(self):
            ...

使用 :func:`~xadmin.views.base.filter_hook` 装饰的方法执行过程中会根据一定原则执行插件中的同名方法，具体信息查考该装饰器的文档内容。

.. autofunction:: xadmin.views.base.filter_hook

根据该装饰器的执行原则，如果我们想修改上面示例中 ``ListAdminView`` 的 ``get_context`` 的返回值，可以在插件中实现如下代码::
    
    class HelloWorldPlugin(BaseAdminPlugin):
        # 在插件中加入同名方法，修改 ``ListAdminView`` 的 ``get_context`` 返回的值
        def get_context(self, context):
            context.update({'hello_target': 'World!!'})
            return context

如果我们希望插件在 ``AdminView`` 的方法前执行，或是完全使用自己的方法替代 ``AdminView`` 的方法可以这样::
    
    class HelloWorldPlugin(BaseAdminPlugin):
        # 第一个参数为 ``__`` 。这样 ``__`` 即为 ``ListAdminView`` 的 ``get_context`` 方法本身，注意，这时还没有执行这个方法。
        def get_context(self, __):
            context = {'hello_target': 'World!!'}
            #我们可以在任何时候执行 ``AdminView`` 的方法，或是根本不执行
            context.update(__())
            return context
    
至此，加入的插件就实现了对 ``AdminView`` 方法的完全控制。

**模板插件**

我们知道，Django 中一个完整的 View 是包含模板的，模板用来生成 View 最终返回的 HTML 内容。当然，插件也可以在模板中插入自己的内容。我们来看看具体如何实现。

首先让我们来看看 |xadmin| 中的模板代码示例片段 (change_list.html):
    
.. code-block:: html
    
    {% load xadmin %}
    ...
    <form id="changelist-form" action="" method="post"{% view_block 'result_list_form' %}>{% csrf_token %}
      {% view_block 'results_top' %}
      <div class="results">
        {% if results %}
        ...

其中的 ``view_block`` Tag 即为插件的 **插入点** 。插件可以在自己的插件类中使用 ``block_`` + ``插入点名称`` 方法将 HTML 片段插入到页面的这个位置，示例如下:
    
.. code-block:: python
    
    class HelloWorldPlugin(BaseAdminPlugin):
        
        # context 即为 TemplateContext， nodes 参数包含了其他插件的返回内容。
        # 您可以直接返回 HTML 片段，或是将内容加入到 nodes 参数中
        def block_results_top(self, context, nodes):
            return s"<div class='info'>Hello %s</div>" % context['hello_target']

插件实例
---------

下面让我们来看一个 |xadmin| 中完整的插件实例::
    
    from django.template import loader

    from xadmin.sites import site
    from xadmin.views import BaseAdminPlugin, ListAdminView
    
    REFRESH_VAR = '_refresh'
    
    # 该插件实现了一个列表页面刷新器的效果
    class RefreshPlugin(BaseAdminPlugin):
    
        # 用户可以定制刷新的频率，可以传入多个值。该属性会被 ``OptionClass`` 的同名属性替换
        refresh_times = []
        
        def init_request(self, *args, **kwargs):
            # 根据用户是否制定了刷新器来决定是否启动该插件
            return bool(self.refresh_times)
    
        # 插件拦截了返回 Media 的方法，加入自己需要的 js 文件。
        def get_media(self, media):
            if self.request.GET.get(REFRESH_VAR):
                # 放页面处于自动刷新状态时，加入自己的 js 制定刷新逻辑
                media.add_js([self.static('xadmin/js/refresh.js')])
            return media
    
        # Block Views
        # 在页面中插入 HTML 片段，显示刷新选项。
        def block_top_toolbar(self, context, nodes):
            current_refresh = self.request.GET.get(REFRESH_VAR)
            context.update({
                'has_refresh': bool(current_refresh),
                'clean_refresh_url': self.admin_view.get_query_string(remove=(REFRESH_VAR,)),
                'current_refresh': current_refresh,
                'refresh_times': [{
                    'time': r,
                    'url': self.admin_view.get_query_string({REFRESH_VAR: r}),
                    'selected': str(r) == current_refresh,
                } for r in self.refresh_times],
            })
            # 可以将 HTML 片段加入 nodes 参数中
            nodes.append(loader.render_to_string('xadmin/blocks/refresh.html', context_instance=context))
    # 注册插件
    site.register_plugin(RefreshPlugin, ListAdminView)
    
最后不要忘记在适当的地方加载该代码， 让其执行。一般情况下，你可以将其写到 adminx.py 文件中，这样，只要您的 APP 加入到 Django Settings 的 INSTALL_APPS 中，
|xadmin| 就会自动执行 app 下的 adminx.py 文件。

插件开发
---------

了解了插件的运行原理后我们就可以开发自己的插件了。首先我们需要了解插件类中的实用方法。因为插件是继承 :class:`~xadmin.views.BaseAdminPlugin` 类，而该类继承自 
:class:`~xadmin.views.BaseAdminObject`，所以这两个类的方法都可以在插件中使用。

|xadmin| 在创建插件时会自动注入以下属性到插件实例中:
    
    * request : Http Request
    
    * user : 当前 User 对象
    
    * args : View 方法的 args 参数
    
    * kwargs : View 方法的 kwargs 参数
    
    * admin_view : ``AdminView`` 实例
    
    * admin_site : |xadmin| 的 ``admin_site`` 对象实例
    
如果 ``AdminView`` 是 :class:`~xadmin.views.ModelAdminView` 的子类，还会自动注入以下属性:
    
    * model : Model 对象
    
    * opts : Model 的 _meta 属性
    
接下来您应该考虑打算制作什么功能的插件了。不同功能的插件额能需要注册到不同的 ``AdminView`` 上，|xadmin| 系统中
主要的 ``AdminView`` 有:
    
    * :class:`~xadmin.views.BaseAdminView` : 所有 ``AdminView`` 的基础类，注册在该 View 上的插件可以影响所有的 ``AdminView``
    
    * :class:`~xadmin.views.CommAdminView` : 用户已经登陆后显示的 View，也是所有登陆后 View 的基础类。该 View主要作用是创建了 |xadmin| 的通用元素，例如：系统菜单，用户信息等。插件可以通过注册该 View 来修改这些信息。
    
    * :class:`~xadmin.views.ModelAdminView` : 基于 Model 的 ``AdminView`` 的基础类，注册的插件可以影响所有基于 Model 的 View。
    
    * :class:`~xadmin.views.ListAdminView` : Model 列表页面 View。
    
    * :class:`~xadmin.views.ModelFormAdminView` : Model 编辑页面 View。
    
    * :class:`~xadmin.views.CreateAdminView` : Model 创建页面 View。
    
    * :class:`~xadmin.views.UpdateAdminView` : Model 修改页面 View。
    
    * :class:`~xadmin.views.DeleteAdminView` : Model 删除页面 View。
    
    * :class:`~xadmin.views.DetailAdminView` : Model 详情页面 View。

选择好目标 ``AdminView`` 后就要在自己的插件中编写方法来修改或增强这些 ``AdminView`` 。其中每个 ``AdminView`` 可以
拦截的方法及其介绍请参看各 ``AdminView`` 的文档。

插件规范
---------

**文档模板**::

    """
    Name
    ======
    
    作者
    ----
    
    该插件的作者信息

    功能
    ----

    描述插件的主要功能

    截图
    ----

    .. image:: /images/plugins/action.png

    使用
    ----

    描述插件的使用方法,  以及使用示例.

    版本
    ----

    描述插件的版本信息

    API
    ---
    .. autoclass:: XXX

    """