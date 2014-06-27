"""
.. automodule:: xadmin.plugins.actions
.. automodule:: xadmin.plugins.filters
.. automodule:: xadmin.plugins.chart
.. automodule:: xadmin.plugins.bookmark
.. automodule:: xadmin.plugins.export
.. automodule:: xadmin.plugins.refresh
.. automodule:: xadmin.plugins.sortable
.. automodule:: xadmin.plugins.details
.. automodule:: xadmin.plugins.editable
"""
PLUGINS = ('actions', 'filters', 'bookmark', 'export', 'layout', 'refresh', 'sortable', 'details',
    'editable', 'relate', 'chart', 'ajax', 'relfield', 'inline', 'topnav', 'portal', 'quickform',
    'wizard', 'images', 'auth', 'multiselect', 'themes', 'aggregation', 'mobile', 'passwords',
    'sitemenu', 'language', 'comments','quickfilter')


def register_builtin_plugins(site):
    from django.utils.importlib import import_module
    from django.conf import settings

    exclude_plugins = getattr(settings, 'XADMIN_EXCLUDE_PLUGINS', [])

    [import_module('xadmin.plugins.%s' % plugin) for plugin in PLUGINS if plugin not in exclude_plugins]
