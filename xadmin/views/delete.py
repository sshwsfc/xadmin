# coding=utf-8
from django.core.exceptions import PermissionDenied
from django.db import transaction, router
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode
from django.utils.html import escape
from django.utils.translation import ugettext as _
from xadmin.util import unquote, get_deleted_objects

from xadmin.views.edit import UpdateAdminView
from xadmin.views.detail import DetailAdminView
from xadmin.views.base import ModelAdminView, filter_hook, csrf_protect_m

class DeleteAdminView(ModelAdminView):
    """
    删除 Model 的 AdminView。主要用于删除数据

    **Option属性**

        .. autoattribute:: delete_confirmation_template

    **实例属性**

        .. attribute:: obj

            即将被删除的对象
    """
    #: 删除时确认删除页面的模板名称
    delete_confirmation_template = None

    def init_request(self, object_id, *args, **kwargs):
        """
        初始化操作。根据传入的 ``object_id`` 取得要被删除的数据对象，而后进行权限判断
        """
        self.obj = self.get_object(unquote(object_id))

        if not self.has_delete_permission(self.obj):
            raise PermissionDenied

        if self.obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        using = router.db_for_write(self.model)    # 取得所用db
        # 生成 deleted_objects, 存有所有即将被删除的关联数据
        (self.deleted_objects, self.perms_needed, self.protected) = get_deleted_objects(
            [self.obj], self.opts, self.request.user, self.admin_site, using)

    @csrf_protect_m
    @filter_hook
    def get(self, request, object_id):
        context = self.get_context()

        return TemplateResponse(request, self.delete_confirmation_template or
                                self.get_template_list("views/model_delete_confirm.html"), context, current_app=self.admin_site.name)

    @csrf_protect_m
    @transaction.commit_on_success
    @filter_hook
    def post(self, request, object_id):
        if self.perms_needed:
            raise PermissionDenied

        self.delete_model()

        response = self.post_response()

        if isinstance(response, basestring):
            # 如果返回字符串，说明是一个url，跳转到该页面
            return HttpResponseRedirect(response)
        else:
            return response

    @filter_hook
    def delete_model(self):
        """
        删除 ``self.obj``
        """
        self.obj.delete()

    @filter_hook
    def get_context(self):
        """
        **Context Params**:

            ``title`` : 确认删除的标题，如果您没有权限删除的话，会提示无法删除

            ``object`` : 要被删除的对象

            ``deleted_objects`` : 关联被删除的所有数据对象

            ``perms_lacking`` : 缺少的权限

            ``protected`` : 被保护的数据，无法被删除的数据对象
        """
        if self.perms_needed or self.protected:
            title = _("Cannot delete %(name)s") % {"name":
                                                   force_unicode(self.opts.verbose_name)}
        else:
            title = _("Are you sure?")

        new_context = {
            "title": title,
            "object": self.obj,
            "deleted_objects": self.deleted_objects,
            "perms_lacking": self.perms_needed,
            "protected": self.protected,
        }
        context = super(DeleteAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_breadcrumb(self):
        bcs = super(DeleteAdminView, self).get_breadcrumb()
        bcs.append({
            'title': force_unicode(self.obj),
            'url': self.get_object_url(self.obj)
        })
        item = {'title': _('Delete')}
        if self.has_delete_permission():
            item['url'] = self.model_admin_url('delete', self.obj.pk)
        bcs.append(item)

        return bcs

    @filter_hook
    def post_response(self):
        """
        删除成功后的操作。首先提示用户信息，而后根据用户权限做跳转，如果用户有列表产看权限就跳转到列表页面，否则跳到网站首页。
        """
        self.message_user(_('The %(name)s "%(obj)s" was deleted successfully.') %
                          {'name': force_unicode(self.opts.verbose_name), 'obj': force_unicode(self.obj)}, 'success')

        if not self.has_view_permission():
            return self.get_admin_url('index')
        return self.model_admin_url('changelist')
