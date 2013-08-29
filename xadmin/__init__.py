from xadmin.sites import AdminSite, site

VERSION = [0, 3, 16]


def autodiscover():
    """
    Auto-discover INSTALLED_APPS admin.py modules and fail silently when
    not present. This forces an import on them to register any admin bits they
    may want.
    """

    from django.conf import settings
    from django.utils.importlib import import_module
    from django.utils.module_loading import module_has_submodule

    setattr(settings, 'CRISPY_TEMPLATE_PACK', 'bootstrap3')
    setattr(settings, 'CRISPY_CLASS_CONVERTERS', {
        "textinput": "textinput textInput form-control",
        "fileinput": "fileinput fileUpload form-control",
        "passwordinput": "textinput textInput form-control",
        })

    from xadmin import views
    from xadmin import plugins

    for app in settings.INSTALLED_APPS:
        mod = import_module(app)
        # Attempt to import the app's admin module.
        try:
            #before_import_registry = site.copy_registry()
            import_module('%s.adminx' % app)
        except:
            # Reset the model registry to the state before the last import as
            # this import will have to reoccur on the next request and this
            # could raise NotRegistered and AlreadyRegistered exceptions
            # (see #8245).
            #site.restore_registry(before_import_registry)

            # Decide whether to bubble up this error. If the app just
            # doesn't have an admin module, we can ignore the error
            # attempting to import it, otherwise we want it to bubble up.
            if module_has_submodule(mod, 'adminx'):
                raise
