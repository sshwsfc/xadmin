

from django.utils.translation import ugettext as _
from django.utils.encoding import StrAndUnicode, force_unicode
from django.core.urlresolvers import reverse

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView
from exadmin.filters import FILTER_PREFIX

RELATE_VAR = '_relate'

class RelateMenuPlugin(BaseAdminPlugin):

    related_list = []
    use_related_menu = True

    def get_related_list(self):
        if hasattr(self, '_related_acts'):
            return self._related_acts
            
        _related_acts = []
        for r in self.model._meta.get_all_related_objects():
            if self.related_list and (r.get_accessor_name() not in self.related_list):
                continue
            f = r.field
            rel_name = f.rel.get_related_field().name
            _related_acts.append((r.opts.app_label, r.opts.module_name, force_unicode(r.opts.verbose_name), f.name, '%s__%s__exact' % (f.name, rel_name)))
        
        self._related_acts = _related_acts
        return self._related_acts
    
    def related_link(self, instance):
        links =[]
        for label, model_name, verbose_name, field_name, lookup_name in self.get_related_list():
            list_url = reverse('%s:%s_%s_changelist' % (self.admin_site.app_name, label, model_name))
            add_url = reverse('%s:%s_%s_add' % (self.admin_site.app_name, label, model_name))
            link = ''.join(('<li class="with_menu_btn">',
            '<a href="%s?%s=%s&%s=%s" title="%s"><i class="icon icon-th-list"></i> %s</a>' % (list_url, FILTER_PREFIX + lookup_name, str(instance.pk), RELATE_VAR, field_name, verbose_name, verbose_name), ' ',
            '<a class="add_link dropdown-menu-btn" href="%s?%s=%s&%s=%s"><i class="icon icon-plus pull-right"></i></a>' % (add_url, field_name, str(instance.pk), RELATE_VAR, field_name),          
             '</li>'))
            links.append(link)
        ul_html = '<ul class="dropdown-menu" role="menu">%s</ul>' % ''.join(links)
        return '<div class="dropdown related_menu pull-left"><a class="relate_menu dropdown-toggle" data-toggle="dropdown"><i class="icon icon-list"></i></a>%s</div>' % ul_html
    related_link.short_description = '&nbsp;'
    related_link.allow_tags = True

    def get_list_display(self, list_display):
        if self.use_related_menu and len(self.get_related_list()):
            list_display.append('related_link')
            self.admin_view.related_link = self.related_link
        return list_display

site.register_plugin(RelateMenuPlugin, ListAdminView)


