

from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.db import models

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ListAdminView, api_manager

class DetailsPlugin(BaseAdminPlugin):

    show_detail_fields = []
    show_all_rel_details = True

    def get_details_url(self, obj):
        resuorce = api_manager.get_resource(obj)
        if resuorce:
            return resuorce.get_resource_uri(obj)
        return None

    def result_item(self, item, obj, field_name, row):
        if hasattr(item.field, 'rel') and isinstance(item.field.rel, models.ManyToOneRel) \
            and (self.show_all_rel_details or (field_name in self.show_detail_fields)):
            rel_obj = getattr(obj, field_name)
            item_res_uri = self.get_details_url(rel_obj)
            if item_res_uri:
                opts = rel_obj._meta
                edit_url = reverse('%s:%s_%s_change' % (self.admin_site.app_name, opts.app_label, opts.module_name), \
                    args=(getattr(rel_obj, opts.pk.attname),))
                item.btns.append('<a data-res-uri="%s" data-edit-uri="%s" class="details-handler" rel="tooltip" title="%s"><i class="icon-info-sign"></i></a>' \
                    % (item_res_uri, edit_url, _(u'Details of %s' % str(rel_obj))))
        return item

    # Media
    def get_media(self, media):
        if self.show_all_rel_details or self.show_detail_fields:
            media.add_js([self.static('exadmin/js/details.js')])
        return media

site.register_plugin(DetailsPlugin, ListAdminView)


