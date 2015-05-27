
PLUGINS = ('actions', 'filters', 'bookmark', 'export', 'layout', 'refresh', 'sortable', 'details',
    'editable', 'relate', 'chart', 'ajax', 'relfield', 'inline', 'topnav', 'portal', 'quickform',
    'wizard', 'images', 'auth', 'multiselect', 'themes', 'aggregation', 'mobile', 'passwords',
    'sitemenu', 'language', 'quickfilter')


def register_builtin_plugins(site):
    from django.conf import settings
    from django.utils.module_loading import import_module

    exclude_plugins = getattr(settings, 'XADMIN_EXCLUDE_PLUGINS', [])

    try:
        import formtools
    except Exception:
        exclude_plugins.append('wizard')

    [import_module('xadmin.plugins.%s' % plugin) for plugin in PLUGINS if plugin not in exclude_plugins]
