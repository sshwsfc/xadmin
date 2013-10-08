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
    delete_confirmation_template = None

    def init_request(self, object_id, *args, **kwargs):
        "The 'delete' admin view for this model."
        self.obj = self.get_object(unquote(object_id))

        if not self.has_delete_permission(self.obj):
            raise PermissionDenied

        if self.obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        using = router.db_for_write(self.model)

        # Populate deleted_objects, a data structure of all related objects that
        # will also be deleted.
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
            return HttpResponseRedirect(response)
        else:
            return response

    @filter_hook
    def delete_model(self):
        """
        Given a model instance delete it from the database.
        """
        self.obj.delete()

    @filter_hook
    def get_context(self):
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

        self.message_user(_('The %(name)s "%(obj)s" was deleted successfully.') %
                          {'name': force_unicode(self.opts.verbose_name), 'obj': force_unicode(self.obj)}, 'success')

        if not self.has_view_permission():
            return self.get_admin_url('index')
        return self.model_admin_url('changelist')
