
from django.template import loader
from django.utils.text import capfirst
from django.core.urlresolvers import reverse, NoReverseMatch
from django.utils.translation import ugettext as _

from xadmin.sites import site
from xadmin.filters import SEARCH_VAR
from xadmin.views import BaseAdminPlugin, CommAdminView


class TopNavPlugin(BaseAdminPlugin):

    globe_search_models = None
    globe_add_models = None

    def get_context(self, context):
        return context

    # Block Views
    def block_top_navbar(self, context, nodes):
        nodes.append(loader.render_to_string(
            'xadmin/blocks/comm.top.topnav.html', {"top_navbar": True}))

    def block_top_navmenu(self, context, nodes):

        search_models = []
        add_models = []

        site_name = self.admin_site.name
        models = self.globe_search_models or self.admin_site._registry.keys()

        for model in models:
            app_label = model._meta.app_label

            if self.has_model_perm(model, "view"):
                info = (app_label, model._meta.module_name)
                if getattr(self.admin_site._registry[model], 'search_fields', None):
                    try:
                        search_models.append({
                            'title': _('Search %s') % capfirst(model._meta.verbose_name_plural),
                            'url': reverse('admin:%s_%s_changelist' % info, current_app=site_name),
                            'model': model
                        })
                    except NoReverseMatch:
                        pass

        models = self.globe_add_models or self.admin_site._registry.keys()
        for model in models:
            app_label = model._meta.app_label

            if self.has_model_perm(model, "add"):
                info = (app_label, model._meta.module_name)
                try:
                    add_models.append({
                        'title': _('Add %s') % capfirst(model._meta.verbose_name),
                        'url': reverse('admin:%s_%s_add' % info, current_app=site_name),
                        'model': model
                    })
                except NoReverseMatch:
                    pass

        nodes.append(
            loader.render_to_string('xadmin/blocks/comm.top.topnav.html',
                                    {'add_models': add_models, 'search_models': search_models, 'search_name': SEARCH_VAR}))


site.register_plugin(TopNavPlugin, CommAdminView)
