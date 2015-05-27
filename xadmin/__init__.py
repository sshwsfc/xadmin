from xadmin.sites import AdminSite, site

VERSION = [0,5,0]


class Settings(object):
    pass


def autodiscover():
    """
    Auto-discover INSTALLED_APPS admin.py modules and fail silently when
    not present. This forces an import on them to register any admin bits they
    may want.
    """

    from django.conf import settings
    from django.utils.module_loading import module_has_submodule, import_module

    setattr(settings, 'CRISPY_TEMPLATE_PACK', 'bootstrap3')
    setattr(settings, 'CRISPY_CLASS_CONVERTERS', {
        "textinput": "textinput textInput form-control",
        "fileinput": "fileinput fileUpload form-control",
        "passwordinput": "textinput textInput form-control",
    })

    from xadmin.views import register_builtin_views
    register_builtin_views(site)

    # load xadmin settings from XADMIN_CONF module
    try:
        xadmin_conf = getattr(settings, 'XADMIN_CONF', 'xadmin_conf.py')
        conf_mod = import_module(xadmin_conf)
    except Exception:
        conf_mod = None

    if conf_mod:
        for key in dir(conf_mod):
            setting = getattr(conf_mod, key)
            try:
                if issubclass(setting, Settings):
                    site.register_settings(setting.__name__, setting)
            except Exception:
                pass

    from xadmin.plugins import register_builtin_plugins
    register_builtin_plugins(site)

    from django.apps import apps
    
    for app_config in apps.get_app_configs():
        # Attempt to import the app's admin module.
        try:
            before_import_registry = site.copy_registry()
            import_module('%s.adminx' % app_config.name)
        except:
            # Reset the model registry to the state before the last import as
            # this import will have to reoccur on the next request and this
            # could raise NotRegistered and AlreadyRegistered exceptions
            # (see #8245).
            site.restore_registry(before_import_registry)

            # Decide whether to bubble up this error. If the app just
            # doesn't have an admin module, we can ignore the error
            # attempting to import it, otherwise we want it to bubble up.
            if module_has_submodule(app_config.module, 'adminx'):
                raise

default_app_config = 'xadmin.apps.XAdminConfig'