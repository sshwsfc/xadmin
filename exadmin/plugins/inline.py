
from django import forms
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from django.template import loader
from django.forms.formsets import DELETION_FIELD_NAME

from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView
from exadmin.layout import FormHelper, Layout, Fieldset, Container, Column, Row

class InlineModelAdmin(ModelFormAdminView):

    model = None
    fk_name = None
    formset = BaseInlineFormSet
    extra = 3
    max_num = None
    template = None
    verbose_name = None
    verbose_name_plural = None
    can_delete = True
    fields = []

    def __init__(self, admin_view):
        super(InlineModelAdmin, self).__init__(self.model, admin_view.admin_site)        
        self.admin_view = admin_view
        self.request = admin_view.request
        self.request_method = admin_view.request_method
        self.user = admin_view.user
        self.parent_model = admin_view.model
        self.org_obj = getattr(admin_view, 'org_obj', None)
        self.model_instance = self.org_obj or admin_view.model()

        if self.verbose_name is None:
            self.verbose_name = self.opts.verbose_name
        if self.verbose_name_plural is None:
            self.verbose_name_plural = self.opts.verbose_name_plural

    @property
    def media(self):
        return forms.Media()

    def get_formset(self, **kwargs):
        """Returns a BaseInlineFormSet class for use in admin add/change views."""
        if self.exclude is None:
            exclude = []
        else:
            exclude = list(self.exclude)
        exclude.extend(self.get_readonly_fields())
        if self.exclude is None and hasattr(self.form, '_meta') and self.form._meta.exclude:
            # Take the custom ModelForm's Meta.exclude into account only if the
            # InlineModelAdmin doesn't define its own.
            exclude.extend(self.form._meta.exclude)
        # if exclude is an empty list we use None, since that's the actual
        # default
        exclude = exclude or None
        can_delete = self.can_delete and self.has_delete_permission()
        defaults = {
            "form": self.form,
            "formset": self.formset,
            "fk_name": self.fk_name,
            "exclude": exclude,
            "formfield_callback": self.admin_view.formfield_for_dbfield,
            "extra": self.extra,
            "max_num": self.max_num,
            "can_delete": can_delete,
        }
        defaults.update(kwargs)
        return inlineformset_factory(self.parent_model, self.model, **defaults)

    def instance_form(self):
        formset = self.get_formset()
        attrs = {
            'instance': self.model_instance,
            'queryset': self.queryset()
        }
        if self.request_method == 'post':
            attrs.update({
                    'data': self.request.POST, 'files': self.request.FILES,
                    'save_as_new': "_saveasnew" in self.request.POST
                })
        instance = formset(**attrs)
        instance.opts = self

        helper = FormHelper()
        helper.form_tag = False
        if self.fields:
            helper.add_layout(Layout(*self.fields + ['id', DELETION_FIELD_NAME]))

        instance.helper = helper
        return instance

    def queryset(self):
        queryset = super(InlineModelAdmin, self).queryset()
        if not self.has_change_permission():
            queryset = queryset.none()
        return queryset

    def has_add_permission(self):
        if self.opts.auto_created:
            # We're checking the rights to an auto-created intermediate model,
            # which doesn't have its own individual permissions. The user needs
            # to have the change permission for the related model in order to
            # be able to do anything with the intermediate model.
            return self.has_change_permission()
        return self.user.has_perm(
            self.opts.app_label + '.' + self.opts.get_add_permission())

    def has_change_permission(self):
        opts = self.opts
        if opts.auto_created:
            # The model was auto-created as intermediary for a
            # ManyToMany-relationship, find the target model
            for field in opts.fields:
                if field.rel and field.rel.to != self.parent_model:
                    opts = field.rel.to._meta
                    break
        return self.user.has_perm(
            opts.app_label + '.' + opts.get_change_permission())

    def has_delete_permission(self):
        if self.opts.auto_created:
            # We're checking the rights to an auto-created intermediate model,
            # which doesn't have its own individual permissions. The user needs
            # to have the change permission for the related model in order to
            # be able to do anything with the intermediate model.
            return self.has_change_permission()
        return self.user.has_perm(
            self.opts.app_label + '.' + self.opts.get_delete_permission())

class StackedInline(InlineModelAdmin):
    template = 'admin/edit_inline/stacked.html'

class TabularInline(InlineModelAdmin):
    template = 'admin/edit_inline/tabular.html'

class InlineFormsetPlugin(BaseAdminPlugin):
    inlines = []

    @property
    def inline_instances(self):
        if not hasattr(self, '_inline_instances'):
            inline_instances = []
            for inline_class in self.inlines:
                inline = inline_class(self.admin_view)
                if not (inline.has_add_permission() or
                        inline.has_change_permission() or
                        inline.has_delete_permission()):
                    continue
                if not inline.has_add_permission():
                    inline.max_num = 0
                inline_instances.append(inline)
            self._inline_instances = inline_instances
        return self._inline_instances

    def instance_forms(self, ret):
        self.formsets = [inline.instance_form() for inline in self.inline_instances]

    def get_context(self, context):
        context['inline_formsets'] = self.formsets
        return context

    # Blocks
    def block_after_fieldsets(self, context, nodes):
        for fs in context.get('inline_formsets', []):
            nodes.append(loader.render_to_string(fs.opts.template, {'formset': fs}, context_instance=context))

site.register_plugin(InlineFormsetPlugin, ModelFormAdminView)


