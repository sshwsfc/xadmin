import copy

from django.forms.formsets import all_valid, DELETION_FIELD_NAME, ORDERING_FIELD_NAME
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from django.template import Context
from django.template.loader import render_to_string
from django.template.defaultfilters import title

from exadmin.layout import FormHelper, Layout
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView
from exadmin.layout import LayoutObject, flatatt, Container, Column

def get_first_field(layout, clz):
    for layout_object in layout.fields:
        if issubclass(layout_object.__class__, clz):
            return layout_object
        elif hasattr(layout_object, 'get_field_names'):
            gf = get_first_field(layout_object, clz)
            if gf:
                return gf

class InlineModelAdmin(ModelFormAdminView):

    fk_name = None
    formset = BaseInlineFormSet
    extra = 3
    max_num = None
    verbose_name = None
    verbose_name_plural = None
    can_delete = True
    fields = []
    admin_view = None
    template = 'admin/edit_inline/stacked.html'

    def init(self, admin_view):
        self.admin_view = admin_view
        self.parent_model = admin_view.model
        self.org_obj = getattr(admin_view, 'org_obj', None)
        self.model_instance = self.org_obj or admin_view.model()

        if self.verbose_name is None:
            self.verbose_name = self.opts.verbose_name
        if self.verbose_name_plural is None:
            self.verbose_name_plural = self.opts.verbose_name_plural

        return self

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
            "formfield_callback": self.formfield_for_dbfield,
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
            fields = copy.copy(self.fields)

            if DELETION_FIELD_NAME not in fields and instance.can_delete:
                fields.append(DELETION_FIELD_NAME)
            if ORDERING_FIELD_NAME not in fields and instance.can_order:
                fields.append(ORDERING_FIELD_NAME)

            fk = getattr(instance, "fk", None)
            if fk:
                fields.append(fk.name)
            if self.has_auto_field(instance[0]):
                fields.append(instance._pk_field.name)

            helper.add_layout(Layout(*fields))

        instance.helper = helper
        return instance

    def has_auto_field(self, form):
        if form._meta.model._meta.has_auto_field:
            return True
        for parent in form._meta.model._meta.get_parent_list():
            if parent._meta.has_auto_field:
                return True
        return False

    def queryset(self):
        queryset = super(InlineModelAdmin, self).queryset()
        if not self.has_change_permission():
            queryset = queryset.none()
        return queryset

    def has_add_permission(self):
        if self.opts.auto_created:
            return self.has_change_permission()
        return self.user.has_perm(
            self.opts.app_label + '.' + self.opts.get_add_permission())

    def has_change_permission(self):
        opts = self.opts
        if opts.auto_created:
            for field in opts.fields:
                if field.rel and field.rel.to != self.parent_model:
                    opts = field.rel.to._meta
                    break
        return self.user.has_perm(
            opts.app_label + '.' + opts.get_change_permission())

    def has_delete_permission(self):
        if self.opts.auto_created:
            return self.has_change_permission()
        return self.user.has_perm(
            self.opts.app_label + '.' + self.opts.get_delete_permission())

class InlineFormset(LayoutObject):

    template = 'admin/edit_inline/stacked.html'

    def __init__(self, formset, **kwargs):
        self.fields = []
        self.legend = title(formset.opts.verbose_name_plural)
        self.css_class = kwargs.pop('css_class', '')
        self.css_id = "%s-group" % formset.prefix
        # Overrides class variable with an instance level variable
        self.template = kwargs.pop('template', self.template)
        self.formset = formset
        self.flat_attrs = flatatt(kwargs)

    def render(self, form, form_style, context):
        return render_to_string(self.template, Context({'formset': self, 'legend': self.legend, 'form_style': form_style}))


class InlineFormsetPlugin(BaseAdminPlugin):
    inlines = []

    @property
    def inline_instances(self):
        if not hasattr(self, '_inline_instances'):
            inline_instances = []
            for inline_class in self.inlines:
                inline = self.admin_view.get_view(InlineModelAdmin, inline_class).init(self.admin_view)
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

    def valid_forms(self, result):
        return all_valid(self.formsets) and result

    def save_related(self):
        for formset in self.formsets:
            formset.instance = self.admin_view.new_obj
            formset.save()

    def get_context(self, context):
        context['inline_formsets'] = self.formsets
        return context

    def get_error_list(self, errors):
        for fs in self.formsets:
            errors.extend(fs.non_form_errors())
            for errors_in_inline_form in fs.errors:
                errors.extend(errors_in_inline_form.values())
        return errors

    def get_form_layout(self, layout):
        container = get_first_field(layout, Column)
        if not container:
            container = get_first_field(layout, Container)
        if not container:
            container = layout
            
        for fs in self.formsets:
            container.append(InlineFormset(fs))
        return layout

    def get_media(self, media):
        for fs in self.formsets:
            media = media + fs.media
        if self.formsets:
            media.add_js([self.static('exadmin/js/formset.js')])
        return media

site.register_plugin(InlineFormsetPlugin, ModelFormAdminView)


