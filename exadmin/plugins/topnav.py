
from django.template import loader
from django.utils.text import capfirst
from django.core.urlresolvers import reverse, NoReverseMatch
from django.utils.translation import ugettext as _

from exadmin.sites import site
from exadmin.filters import SEARCH_VAR
from exadmin.views import BaseAdminPlugin, CommAdminView

class TopNavPlugin(BaseAdminPlugin):

    globe_search_models = None
    globe_add_models = None

    def get_model_perms(self):
        return {
            'add': True,
            'change': True,
            'delete': True,
        }

    # Block Views
    def block_top_navbar(self, context, nodes):

        search_models = []

        site_name = self.admin_site.name
        models = self.globe_search_models or self.admin_site._registry.keys()

        for model in models:
            app_label = model._meta.app_label
            has_module_perms = self.user.has_module_perms(app_label)

            if has_module_perms:
                perms = self.get_model_perms()

                if True in perms.values():
                    info = (app_label, model._meta.module_name)
                    if perms.get('change', False) and getattr(self.admin_site._registry[model], 'search_fields', None):
                        try:
                            search_models.append({
                                'title': _('Search %s') % capfirst(model._meta.verbose_name_plural),
                                'url': reverse('admin:%s_%s_changelist' % info, current_app=site_name),
                                'model': model
                                })
                        except NoReverseMatch:
                            pass
        nodes.append(loader.render_to_string('admin/blocks/topnav.html', {'search_models': search_models, 'search_name': SEARCH_VAR}))

    def block_top_nav_btn(self, context, nodes):

        add_models = []

        site_name = self.admin_site.name
        models = self.globe_add_models or self.admin_site._registry.keys()

        for model in models:
            app_label = model._meta.app_label
            has_module_perms = self.user.has_module_perms(app_label)

            if has_module_perms:
                perms = self.get_model_perms()

                if True in perms.values():
                    info = (app_label, model._meta.module_name)
                    if perms.get('add', False):
                        try:
                            add_models.append({
                                'title': _('Add %s') % capfirst(model._meta.verbose_name),
                                'url': reverse('admin:%s_%s_add' % info, current_app=site_name),
                                'model': model
                                })
                        except NoReverseMatch:
                            pass
        nodes.append(loader.render_to_string('admin/blocks/topnav.html', {'add_models': add_models}))


site.register_plugin(TopNavPlugin, CommAdminView)


