from django.http import HttpResponse
from django.utils import simplejson
from django.utils.html import escape
from django import forms
from django.conf import settings
from django.template.response import SimpleTemplateResponse, TemplateResponse
from django.utils.html import conditional_escape
from django.utils.encoding import StrAndUnicode, force_unicode
from django.utils.safestring import mark_safe
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from django.utils.datastructures import SortedDict
from django import template
from django.db import models, transaction, connection
from django.conf.urls.defaults import patterns, url
from django.contrib.contenttypes.generic import GenericInlineModelAdmin, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.forms.formsets import all_valid
from django.forms.models import model_to_dict
from django.http import HttpResponseRedirect
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404, render_to_response
from django.utils.html import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _
from django.utils.encoding import force_unicode
from django.utils.formats import localize

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelAdminView, ModelFormAdminView, DeleteAdminView, ListAdminView
from exadmin.views.base import csrf_protect_m

from reversion.models import Revision, Version, has_int_pk, VERSION_ADD, VERSION_CHANGE, VERSION_DELETE
from reversion.revisions import default_revision_manager, RegistrationError

def _autoregister(admin, model, follow=None):
    """Registers a model with reversion, if required."""
    if model._meta.proxy:
        raise RegistrationError("Proxy models cannot be used with django-reversion, register the parent class instead")
    if not admin.revision_manager.is_registered(model):
        follow = follow or []
        for parent_cls, field in model._meta.parents.items():
            follow.append(field.name)
            _autoregister(admin, parent_cls)
        admin.revision_manager.register(model, follow=follow, format=admin.reversion_format)

def _registe_model(admin, model):
    if not hasattr(admin, 'revision_manager'):
        admin.revision_manager = default_revision_manager
    if not hasattr(admin, 'reversion_format'):
        admin.reversion_format = 'json'

    if not admin.revision_manager.is_registered(model):
        inline_fields = []
        for inline in getattr(admin, '_inlines', []):
            inline_model = inline.model
            if issubclass(inline, GenericInlineModelAdmin):
                ct_field = inline.ct_field
                ct_fk_field = inline.ct_fk_field
                for field in model._meta.many_to_many:
                    if isinstance(field, GenericRelation) and field.rel.to == inline_model and field.object_id_field_name == ct_fk_field and field.content_type_field_name == ct_field:
                        inline_fields.append(field.name)
                _autoregister(admin, inline_model)
            else:
                fk_name = inline.fk_name
                if not fk_name:
                    for field in inline_model._meta.fields:
                        if isinstance(field, (models.ForeignKey, models.OneToOneField)) and issubclass(model, field.rel.to):
                            fk_name = field.name
                _autoregister(admin, inline_model, follow=[fk_name])
                if not inline_model._meta.get_field(fk_name).rel.is_hidden():
                    accessor = inline_model._meta.get_field(fk_name).related.get_accessor_name()
                    inline_fields.append(accessor)
        _autoregister(admin, model, inline_fields)

def registe_models(admin_site=None):
    if admin_site is None:
        admin_site = site

    for model, admin in admin_site._registry.items():
        if getattr(admin, 'reversion_enable', False):
            _registe_model(admin, model)

class ReversionPlugin(BaseAdminPlugin):
    
    # The revision manager instance used to manage revisions.
    revision_manager = default_revision_manager
    
    # The serialization format to use when registering models with reversion.
    reversion_format = "json"
    
    # Whether to ignore duplicate revision data.
    ignore_duplicate_revisions = False

    reversion_enable = False

    def init_request(self, *args, **kwargs):
        return self.reversion_enable

    @property
    def revision_context_manager(self):
        """The revision context manager for this VersionAdmin."""
        return self.revision_manager._revision_context_manager

    def get_revision_instances(self, obj):
        """Returns all the instances to be used in the object's revision."""
        return [obj]
    
    def get_revision_data(self, obj, flag):
        """Returns all the revision data to be used in the object's revision."""
        return dict(
            (o, self.revision_manager.get_adapter(o.__class__).get_version_data(o, flag))
            for o in self.get_revision_instances(obj)
        )

    def save_revision(self, obj, tag, comment):
        self.revision_manager.save_revision(
            self.get_revision_data(obj, tag),
            user = self.user,
            comment = comment,
            ignore_duplicates = self.ignore_duplicate_revisions,
            db = self.revision_context_manager.get_db(),
        )

    def save_models(self, __):
        self.revision_context_manager.create_revision(manage_manually=True)(__)()

        if self.admin_view.org_obj is None:
            self.save_revision(self.admin_view.new_obj, VERSION_ADD, _(u"Initial version."))
        else:
            self.save_revision(self.admin_view.new_obj, VERSION_CHANGE, _(u"Change version."))

    def save_related(self, __):
        self.revision_context_manager.create_revision(manage_manually=True)(__)()

    def delete_model(self, __):
        self.save_revision(self.admin_view.obj, VERSION_DELETE, \
            _(u"Deleted %(verbose_name)s.") % {"verbose_name": self.opts.verbose_name})
        self.revision_context_manager.create_revision(manage_manually=True)(__)()


    # Block Views
    def block_top_toolbar(self, context, nodes):
        recoverlist_url = self.admin_view.model_admin_urlname('recoverlist')
        nodes.append(mark_safe('<a class="btn btn-small" href="%s"><i class="icon-trash"></i> %s</a>' % (recoverlist_url, _(u"Recover deleted"))))

class BaseReversionView(ModelAdminView):

    object_history_template = "reversion/object_history.html"
    
    change_list_template = "reversion/change_list.html"
    
    revision_form_template = None

    recover_list_template = None

    recover_form_template = None
    
    # The revision manager instance used to manage revisions.
    revision_manager = default_revision_manager
    
    # The serialization format to use when registering models with reversion.
    reversion_format = "json"
    
    # Whether to ignore duplicate revision data.
    ignore_duplicate_revisions = False
    
    # If True, then the default ordering of object_history and recover lists will be reversed.
    history_latest_first = False

    reversion_enable = False

    def init_request(self, *args, **kwargs):
        if not self.has_change_permission() and not self.has_add_permission():
            raise PermissionDenied

    def _order_version_queryset(self, queryset):
        """Applies the correct ordering to the given version queryset."""
        if self.history_latest_first:
            return queryset.order_by("-pk")
        return queryset.order_by("pk")

class RecoverListView(BaseReversionView):

    def get_context(self):
        context = super(RecoverListView, self).get_context()
        opts = self.opts
        deleted = self._order_version_queryset(self.revision_manager.get_deleted(self.model))
        context.update({
            "opts": opts,
            "app_label": opts.app_label,
            "module_name": capfirst(opts.verbose_name),
            "title": _("Recover deleted %(name)s") % {"name": force_unicode(opts.verbose_name_plural)},
            "deleted": deleted,
            "changelist_url": self.model_admin_urlname("changelist"),
        })
        return context

    @csrf_protect_m
    def get(self, request, *args, **kwargs):
        context = self.get_context()

        return TemplateResponse(request, self.recover_list_template or self.get_template_list("recover_list.html"),
            context, current_app=self.admin_site.name)
        

site.register(Revision)
site.register(Version)

site.register_modelview(r'^recover/$', RecoverListView, name='%s_%s_recoverlist')

site.register_plugin(ReversionPlugin, ListAdminView)
site.register_plugin(ReversionPlugin, ModelFormAdminView)
site.register_plugin(ReversionPlugin, DeleteAdminView)


