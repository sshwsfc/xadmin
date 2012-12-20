from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.db import transaction, router
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.utils.encoding import force_unicode
from django.utils.html import escape
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_protect
from exadmin.util import unquote, get_deleted_objects

from base import ModelAdminView, filter_hook


csrf_protect_m = method_decorator(csrf_protect)

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
    def get(self, request, object_id):
        context = self.get_context()
        
        app_label = self.opts.app_label
        return TemplateResponse(request, self.delete_confirmation_template or [
            "admin/%s/%s/delete_confirmation.html" % (app_label, self.opts.object_name.lower()),
            "admin/%s/delete_confirmation.html" % app_label,
            "admin/delete_confirmation.html"
        ], context, current_app=self.admin_site.name)

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request, object_id):
        if self.perms_needed:
            raise PermissionDenied
        obj_display = force_unicode(self.obj)
        
        self.delete_model()

        self.message_user(_('The %(name)s "%(obj)s" was deleted successfully.') % {'name': force_unicode(self.opts.verbose_name), 'obj': force_unicode(obj_display)})

        if not self.has_change_permission(None):
            return HttpResponseRedirect(reverse('admin:index',
                                                current_app=self.admin_site.name))
        return HttpResponseRedirect(reverse('admin:%s_%s_changelist' %
                                    (self.opts.app_label, self.opts.module_name),
                                    current_app=self.admin_site.name))

    @filter_hook
    def delete_model(self):
        """
        Given a model instance delete it from the database.
        """
        self.obj.delete()

    @filter_hook
    def get_context(self):        
        object_name = force_unicode(self.opts.verbose_name)
        app_label = self.opts.app_label

        if self.perms_needed or self.protected:
            title = _("Cannot delete %(name)s") % {"name": object_name}
        else:
            title = _("Are you sure?")

        new_context = {
            "title": title,
            "object_name": object_name,
            "object": self.obj,
            "deleted_objects": self.deleted_objects,
            "perms_lacking": self.perms_needed,
            "protected": self.protected,
            "opts": self.opts,
            "app_label": app_label,
        }
        context = super(DeleteAdminView, self).get_context()
        context.update(new_context)
        return context




