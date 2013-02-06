.. |xadmin| replace:: Xadmin

.. _quickstart:

快速开始 Xadmin
=================

For using |xadmin|, `Django 1.4 <http://www.djangoproject.com>`_ needs to be installed and an `Admin Site <http://docs.djangoproject.com/en/dev/ref/contrib/admin/>`_ has to be activated.

安装
----

使用 ``pip``::

    pip install django-xadmin

**源码安装**
    
到 https://github.com/sshwsfc/django-xadmin 下载最新的源码包或是 clone git 库, 然后在项目目录下执行::
    
    pip install -r requirements.txt

.. note::

    在执行前您可以先编辑文件 ``requirements.txt`` , 其中 ``xlwt`` 不是必选的, 如果您不需要导出 excel 的功能, 可以删除这项

运行 Demo
---------

如果您下载的是 |xadmin| 的源码包, 您会在项目目录下找到 ``demo_app`` 目录, 执行一下命令可以迅速开启一个 |xadmin| 的演示实例::

    cd demo_app
    python manage.py runserver

打开浏览器, 输入 ``http://127.0.0.1:8000`` 看一下效果吧.

使用在自己的项目中
------------------

|xadmin| 作为 Django 的模块, 可以很方便的使用在 Django 的网站中. 

首先编辑 ``settings.py`` 添加 |xadmin| 的模块到 ``INSTALLED_APPS`` 中 (注意, 安装 Django admin 所需要的 APP 也要安装, 但是 django.admin 可以不安装)::

    INSTALLED_APPS = (
        ...

        'exadmin',
        'crispy_forms',
        'reversion',

        ...
    )

然后添加 URL-patterns 以及 ``autodiscover`` 操作::

    import exadmin
    exadmin.autodiscover()

    # version模块自动注册需要版本控制的 Model
    from exadmin.plugins import xversion
    xversion.registe_models()

    urlpatterns = patterns('',
        url(r'xadmin/', include(exadmin.site.urls)),
    )

收集 media 文件::

    python manage.py collectstatic


