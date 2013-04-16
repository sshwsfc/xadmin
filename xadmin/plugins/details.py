# coding=utf-8
"""
显示数据详情
============

功能
----

该插件可以在列表页中显示相关字段的详细信息, 使用 Ajax 在列表页中显示.

截图
----

.. image:: /images/plugins/details.png

使用
----

使用该插件主要设置 OptionClass 的 ``show_detail_fields``, ``show_all_rel_details`` 两个属性. ``show_detail_fields`` 属性设置哪些字段要显示详细信息, 
``show_all_rel_details`` 属性设置时候自动显示所有关联字段的详细信息, 该属性默认为 ``True``. 示例如下::

    class MyModelAdmin(object):
        
        show_detail_fields = ['group', 'father', ...]

"""
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse
from django.db import models

from xadmin.sites import site
from xadmin.views import BaseAdminPlugin, ListAdminView

class DetailsPlugin(BaseAdminPlugin):

    show_detail_fields = []
    show_all_rel_details = True

    def result_item(self, item, obj, field_name, row):
        if hasattr(item.field, 'rel') and isinstance(item.field.rel, models.ManyToOneRel) \
            and (self.show_all_rel_details or (field_name in self.show_detail_fields)):
            rel_obj = getattr(obj, field_name)
            if rel_obj and self.has_model_perm(rel_obj.__class__, 'view'):
                opts = rel_obj._meta
                item_res_uri = reverse('%s:%s_%s_detail' % (self.admin_site.app_name, opts.app_label, opts.module_name), \
                        args=(getattr(rel_obj, opts.pk.attname),))
                if item_res_uri:
                    edit_url = reverse('%s:%s_%s_change' % (self.admin_site.app_name, opts.app_label, opts.module_name), \
                        args=(getattr(rel_obj, opts.pk.attname),))
                    item.btns.append('<a data-res-uri="%s" data-edit-uri="%s" class="details-handler" rel="tooltip" title="%s"><i class="icon-info-sign"></i></a>' \
                        % (item_res_uri, edit_url, _(u'Details of %s' % str(rel_obj))))
        return item

    # Media
    def get_media(self, media):
        if self.show_all_rel_details or self.show_detail_fields:
            media.add_js([self.static('xadmin/js/details.js')])
            media.add_css({'screen': [self.static('xadmin/css/bootstrap-modal.css'), self.static('xadmin/css/form.css')]})
        return media

site.register_plugin(DetailsPlugin, ListAdminView)


