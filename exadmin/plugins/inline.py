import copy

from django import forms
from django.forms.formsets import all_valid, DELETION_FIELD_NAME
from django.forms.models import inlineformset_factory, BaseInlineFormSet
from django.template import loader, Context
from django.template.loader import render_to_string
from exadmin.layout import FormHelper, Layout, flatatt, Container, Column, Field, Fieldset
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView, DetailAdminView, filter_hook
from exadmin.views.detail import ResultField


class ShowField(Field):
    template = "admin/layout/field_value.html"

    def __init__(self, admin_view, *args, **kwargs):
        super(ShowField, self).__init__(*args, **kwargs)
        self.admin_view = admin_view

    def render(self, form, form_style, context):
        html = ''
        for field in self.fields:
            if not isinstance(form.fields[field].widget, forms.HiddenInput):
                result = ResultField(form.instance, field, self.admin_view)
                html += loader.render_to_string(self.template, {'field': form[field], 'result': result})
        return html

class DeleteField(Field):

    def render(self, form, form_style, context):
        if form.instance.pk:
            self.attrs['type'] = 'hidden'
            return super(DeleteField, self).render(form, form_style, context)
        else:
            return ""

class TDField(Field):
    template = "admin/layout/td-field.html"

class InlineStyleManager(object):
    inline_styles = {}

    def register_style(self, name, style):
        self.inline_styles[name] = style
    def get_style(self, name=None):
        return self.inline_styles.get(name)

style_manager = InlineStyleManager()

class InlineStyle(object):
    template = 'admin/edit_inline/stacked.html'
    def __init__(self, view, formset):
        self.view = view
        self.formset = formset
    def update_layout(self, helper):
        pass
    def get_attrs(self):
        return {}
style_manager.register_style(None, InlineStyle)

class OneInlineStyle(InlineStyle):
    template = 'admin/edit_inline/one.html'
style_manager.register_style("one", OneInlineStyle)

class AccInlineStyle(InlineStyle):
    template = 'admin/edit_inline/accordion.html'
style_manager.register_style("accordion", AccInlineStyle)

class TabInlineStyle(InlineStyle):
    template = 'admin/edit_inline/tab.html'
style_manager.register_style("tab", TabInlineStyle)

class TableInlineStyle(InlineStyle):
    template = 'admin/edit_inline/tabular.html'
    def update_layout(self, helper):
        helper.add_layout(Layout(*[TDField(f) for f in self.formset[0].fields.keys()]))
    def get_attrs(self):
        return {'fields': [f for k,f in self.formset[0].fields.items() if k != DELETION_FIELD_NAME]}
style_manager.register_style("table", TableInlineStyle)

def replace_field_to_value(layout, av):
    for i, lo in enumerate(layout.fields):
        if isinstance(lo, Field) or issubclass(lo.__class__, Field):
            layout.fields[i] = ShowField(av, *lo.fields, **lo.attrs)
        elif isinstance(lo, basestring):
            layout.fields[i] = ShowField(av, lo)
        elif hasattr(lo, 'get_field_names'):
            replace_field_to_value(lo, av)

class InlineModelAdmin(ModelFormAdminView):

    fk_name = None
    formset = BaseInlineFormSet
    extra = 3
    max_num = None
    can_delete = True
    fields = []
    admin_view = None
    style = None

    def init(self, admin_view):
        self.admin_view = admin_view
        self.parent_model = admin_view.model
        self.org_obj = getattr(admin_view, 'org_obj', None)
        self.model_instance = self.org_obj or admin_view.model()

        return self

    @filter_hook
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

    @filter_hook
    def instance_form(self, **kwargs):
        formset = self.get_formset(**kwargs)
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
        instance.view = self

        helper = FormHelper()
        helper.form_tag = False

        style = style_manager.get_style('one' if self.max_num == 1 else self.style)(self, instance)

        if len(instance):
            layout = copy.deepcopy(self.form_layout)

            if layout is None:
                layout = Layout(*instance[0].fields.keys())
            elif type(layout) in (list, tuple) and len(layout) > 0:
                layout = Layout(*layout)

                rendered_fields = [i[1] for i in layout.get_field_names()]
                layout.extend([f for f in instance[0].fields.keys() if f not in rendered_fields])
       
            helper.add_layout(layout)

            style.update_layout(helper)

            # replace delete field with Dynamic field, for hidden delete field when instance is NEW.
            helper[DELETION_FIELD_NAME].wrap(DeleteField)

        instance.helper = helper
        instance.style = style

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

class InlineFormset(Fieldset):

    def __init__(self, formset, **kwargs):
        self.fields = []
        self.css_class = kwargs.pop('css_class', '')
        self.css_id = "%s-group" % formset.prefix
        if len(formset):
            self.template = formset.style.template
        else:
            self.template = 'admin/edit_inline/blank.html'
        self.formset = formset
        self.model = formset.model
        self.opts = formset.model._meta
        self.flat_attrs = flatatt(kwargs)
        self.extra_attrs = formset.style.get_attrs()

    def render(self, form, form_style, context):
        return render_to_string(self.template, Context(\
            dict({'formset': self, 'prefix': self.formset.prefix, 'form_style': form_style}, **self.extra_attrs)))

class Inline(Fieldset):

    def __init__(self, rel_model):
        self.model = rel_model
        self.fields = []

    def render(self, form, form_style, context):
        return ""

def get_first_field(layout, clz):
    for layout_object in layout.fields:
        if issubclass(layout_object.__class__, clz):
            return layout_object
        elif hasattr(layout_object, 'get_field_names'):
            gf = get_first_field(layout_object, clz)
            if gf:
                return gf

def replace_inline_objects(layout, fs):
    if not fs:
        return
    for i, layout_object in enumerate(layout.fields):
        if isinstance(layout_object, Inline) and fs.has_key(layout_object.model):
            layout.fields[i] = fs.pop(layout_object.model)
        elif hasattr(layout_object, 'get_field_names'):
            replace_inline_objects(layout_object, fs)

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
        self.admin_view.formsets = self.formsets

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
        fs = dict([(f.model, InlineFormset(f)) for f in self.formsets])
        replace_inline_objects(layout, fs)

        if fs:
            container = get_first_field(layout, Column)
            if not container:
                container = get_first_field(layout, Container)
            if not container:
                container = layout

            for fs in fs.values():
                container.append(fs)

        return layout

    def get_media(self, media):
        for fs in self.formsets:
            media = media + fs.media
        if self.formsets:
            media.add_js([self.static('exadmin/js/formset.js')])
            media.add_css({'screen': [self.static('exadmin/css/formset.css')]})
        return media

class DetailInlineFormsetPlugin(InlineFormsetPlugin):

    def _get_formset_instance(self, inline):
        formset = inline.instance_form(extra=0, max_num=0, can_delete=0)
        formset.detail_page = True
        if formset.helper.layout:
            replace_field_to_value(formset.helper.layout, inline)
        return formset

    def get_model_form(self, form, **kwargs):
        self.formsets = [self._get_formset_instance(inline) for inline in self.inline_instances]
        return form

site.register_plugin(InlineFormsetPlugin, ModelFormAdminView)
site.register_plugin(DetailInlineFormsetPlugin, DetailAdminView)


