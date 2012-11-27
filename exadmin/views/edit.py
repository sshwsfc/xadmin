import copy

from django import forms
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.db import models, transaction
from django.forms.models import modelform_factory
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode
from django.utils.html import escape
from django.utils.translation import ugettext as _
from exadmin import widgets
from exadmin.layout import FormHelper, Layout, Fieldset, Container, Column
from exadmin.util import unquote

from base import ModelAdminView, filter_hook, csrf_protect_m


FORMFIELD_FOR_DBFIELD_DEFAULTS = {
    models.DateTimeField: {
        'form_class': forms.SplitDateTimeField,
        'widget': widgets.AdminSplitDateTime
    },
    models.DateField:       {'widget': widgets.AdminDateWidget},
    models.TimeField:       {'widget': widgets.AdminTimeWidget},
    models.TextField:       {'widget': widgets.AdminTextareaWidget},
    models.URLField:        {'widget': widgets.AdminURLFieldWidget},
    models.IntegerField:    {'widget': widgets.AdminIntegerFieldWidget},
    models.BigIntegerField: {'widget': widgets.AdminIntegerFieldWidget},
    models.CharField:       {'widget': widgets.AdminTextInputWidget},
    models.ImageField:      {'widget': widgets.AdminFileWidget},
    models.FileField:       {'widget': widgets.AdminFileWidget},
}

class ModelFormAdminView(ModelAdminView):

    raw_id_fields = ()
    form = forms.ModelForm
    formfield_overrides = {}
    readonly_fields = ()
    style_fields = {}
    relfield_style = None
    prepopulated_fields = {}

    save_as = False
    save_on_top = False

    add_form_template = None
    change_form_template = None

    form_layout = None

    def formfield_for_dbfield(self, db_field, **kwargs):
        attrs = self.get_field_attrs(db_field, **kwargs)
        attrs.update(kwargs)
        return db_field.formfield(**attrs)

    @filter_hook
    def get_field_style(self, db_field, style, **kwargs):
        if style in ('radio', 'radio-inline') and (db_field.choices or isinstance(db_field, models.ForeignKey)):
            attrs = {'widget': widgets.AdminRadioSelect(attrs={'class': 'inline' if style == 'radio-inline' else ""})}
            if db_field.choices:
                attrs['choices'] = db_field.get_choices(
                    include_blank = db_field.blank,
                    blank_choice=[('', _('None'))]
                )
            return attrs

        if style in ('checkbox', 'checkbox-inline') and isinstance(db_field, models.ManyToManyField):
            return {'widget': widgets.AdminCheckboxSelect(attrs={'class': 'inline' if style == 'checkbox-inline' else ""}),
                'help_text': None}

    @filter_hook
    def get_field_attrs(self, db_field, **kwargs):

        if db_field.name in self.style_fields:
            attrs = self.get_field_style(db_field, self.style_fields[db_field.name], **kwargs)
            if attrs:
                return attrs

        if hasattr(db_field, "rel") and db_field.rel:
            related_modeladmin = self.admin_site._registry.get(db_field.rel.to)
            if related_modeladmin and hasattr(related_modeladmin, 'relfield_style'):
                attrs = self.get_field_style(db_field, related_modeladmin.relfield_style, **kwargs)
                if attrs:
                    return attrs

        if db_field.choices:
            return {}

        for klass in db_field.__class__.mro():
            if klass in self.formfield_overrides:
                return self.formfield_overrides[klass]
                
        return {}

    @filter_hook
    def prepare_form(self):
        overrides = FORMFIELD_FOR_DBFIELD_DEFAULTS.copy()
        overrides.update(self.formfield_overrides)
        self.formfield_overrides = overrides
        self.model_form = self.get_model_form()

    @filter_hook
    def instance_forms(self):
        self.form_obj = self.model_form(**self.get_form_params())
        helper = self.get_form_helper()
        if helper:
            self.form_obj.helper = helper

    @filter_hook
    def valid_forms(self):
        return self.form_obj.is_valid()

    @filter_hook
    def get_model_form(self, **kwargs):
        """
        Returns a Form class for use in the admin add view. This is used by
        add_view and change_view.
        """
        if self.exclude is None:
            exclude = []
        else:
            exclude = list(self.exclude)
        exclude.extend(self.get_readonly_fields())
        if self.exclude is None and hasattr(self.form, '_meta') and self.form._meta.exclude:
            # Take the custom ModelForm's Meta.exclude into account only if the
            # ModelAdmin doesn't define its own.
            exclude.extend(self.form._meta.exclude)
        # if exclude is an empty list we pass None to be consistant with the
        # default on modelform_factory
        exclude = exclude or None
        defaults = {
            "form": self.form,
            "exclude": exclude,
            "formfield_callback": self.formfield_for_dbfield,
        }
        defaults.update(kwargs)
        return modelform_factory(self.model, **defaults)

    @filter_hook
    def get_form_layout(self):
        layout = copy.deepcopy(self.form_layout)
        title = "%s %s" % (_(u'Add'), self.opts.verbose_name)

        if layout is None:
            layout = Layout(Container(
                    Fieldset(title, *self.form_obj.fields.keys()), css_class="form-horizontal"
                    ))

        if type(layout) in (list, tuple) and len(layout) > 0:
            if isinstance(layout[0], Column):
                layout = Layout(Container(*layout))
            elif isinstance(layout[0], Fieldset):
                layout = Layout(Container(*layout, css_class="form-horizontal"))
            else:
                layout = Layout(Container(Fieldset(title, *layout), css_class="form-horizontal"))

            rendered_fields = [i[1] for i in layout.get_field_names()]
            container = layout[0].fields
            other_fieldset = Fieldset(_(u'Other Fields'), *[f for f in self.form_obj.fields.keys() if f not in rendered_fields])

            if len(other_fieldset.fields):
                if len(container) and isinstance(container[0], Column):
                    container[0].fields.append(other_fieldset)
                else:
                    container.append(other_fieldset)

        return layout

    @filter_hook
    def get_form_helper(self):
        helper = FormHelper()
        helper.form_tag = False
        helper.add_layout(self.get_form_layout())
        return helper

    @filter_hook
    def get_readonly_fields(self):
        """
        Hook for specifying custom readonly fields.
        """
        return self.readonly_fields

    @filter_hook
    def get_prepopulated_fields(self):
        """
        Hook for specifying custom prepopulated fields.
        """
        return self.prepopulated_fields

    @filter_hook
    def save_forms(self):
        self.new_obj = self.form_obj.save(commit=False)

    @filter_hook
    def save_models(self):
        self.new_obj.save()

    @filter_hook
    def save_related(self):
        self.form_obj.save_m2m()

    @csrf_protect_m
    def get(self, request, *args, **kwargs):
        self.instance_forms()
        return self.get_response()

    @csrf_protect_m
    @transaction.commit_on_success
    def post(self, request, *args, **kwargs):
        self.instance_forms()

        if self.valid_forms():
            self.save_forms()
            self.save_models()
            self.save_related()
            return self.post_response()

        return self.get_response()

    @filter_hook
    def get_context(self):
        form = self.form_obj

        media = self.media + form.media
        ordered_objects = self.opts.get_ordered_objects()

        new_context = {
            'form': form,
            'is_popup': "_popup" in self.request.REQUEST,
            'media': media,
            'original': self.org_obj,
            'show_delete': self.org_obj is not None,
            'add': self.org_obj is None,
            'change': self.org_obj is not None,
            'errors': self.get_error_list(),
            'app_label': self.opts.app_label,
            'has_add_permission': self.has_add_permission(),
            'has_change_permission': self.has_change_permission(self.org_obj),
            'has_delete_permission': self.has_delete_permission(self.org_obj),
            'has_file_field': True, # FIXME - this should check if form or formsets have a FileField,
            'has_absolute_url': hasattr(self.model, 'get_absolute_url'),
            'ordered_objects': ordered_objects,
            'form_url': '',
            'opts': self.opts,
            'content_type_id': ContentType.objects.get_for_model(self.model).id,
            'save_as': self.save_as,
            'save_on_top': self.save_on_top,
        }

        context = super(ModelFormAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_error_list(self):
        errors = forms.util.ErrorList()
        if self.form_obj.is_bound:
            errors.extend(self.form_obj.errors.values())
        return errors

    @filter_hook
    def get_media(self):
        media = super(ModelFormAdminView, self).get_media()
        media.add_js([self.static('exadmin/js/select2.js'), self.static('exadmin/js/form.js')])
        media.add_css({'screen': [self.static('exadmin/css/form.css'), self.static('exadmin/css/select2.css')]})
        return media

class CreateAdminView(ModelFormAdminView):

    def init_request(self, *args, **kwargs):
        self.org_obj = None

        if not self.has_add_permission():
            raise PermissionDenied

        # comm method for both get and post
        self.prepare_form()

    @filter_hook
    def get_form_params(self):
        # Prepare the dict of initial data from the request.
        # We have to special-case M2Ms as a list of comma-separated PKs.
        if self.request_method == 'get':
            initial = dict(self.request.GET.items())
            for k in initial:
                try:
                    f = self.opts.get_field(k)
                except models.FieldDoesNotExist:
                    continue
                if isinstance(f, models.ManyToManyField):
                    initial[k] = initial[k].split(",")
            return {'initial':initial}
        else:
            return {'data': self.request.POST, 'files': self.request.FILES}

    @filter_hook
    def get_context(self):
        new_context = {
            'title': _('Add %s') % force_unicode(self.opts.verbose_name),
        }
        context = super(CreateAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_response(self):
        context = self.get_context()
        context.update(self.kwargs or {})

        form_template = self.add_form_template

        return TemplateResponse(self.request, form_template or [
            "admin/%s/%s/change_form.html" % (self.opts.app_label, self.opts.object_name.lower()),
            "admin/%s/change_form.html" % self.opts.app_label,
            "admin/change_form.html"
        ], context, current_app=self.admin_site.name)

    @filter_hook
    def post_response(self):
        """
        Determines the HttpResponse for the add_view stage.
        """
        request = self.request
        obj = self.new_obj

        opts = obj._meta
        pk_value = obj._get_pk_val()

        msg = _('The %(name)s "%(obj)s" was added successfully.') % {'name': force_unicode(opts.verbose_name), 'obj': force_unicode(obj)}
        # Here, we distinguish between different save types by checking for
        # the presence of keys in request.POST.
        if "_continue" in request.POST:
            self.message_user(msg + ' ' + _("You may edit it again below."))
            return HttpResponseRedirect("../%s/" % pk_value)

        if "_addanother" in request.POST:
            self.message_user(msg + ' ' + (_("You may add another %s below.") % force_unicode(opts.verbose_name)))
            return HttpResponseRedirect(request.path)
        else:
            self.message_user(msg)

            # Figure out where to redirect. If the user has change permission,
            # redirect to the change-list page for this object. Otherwise,
            # redirect to the admin index.
            if self.has_change_permission(None):
                post_url = reverse('admin:%s_%s_changelist' %
                                   (opts.app_label, opts.module_name),
                                   current_app=self.admin_site.name)
            else:
                post_url = reverse('admin:index',
                                   current_app=self.admin_site.name)
            return HttpResponseRedirect(post_url)


class UpdateAdminView(ModelFormAdminView):
    
    def init_request(self, object_id, *args, **kwargs):
        self.org_obj = self.get_object(unquote(object_id))

        if not self.has_change_permission(self.org_obj):
            raise PermissionDenied

        if self.org_obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') % \
                {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        if self.request.method == 'POST' and "_saveasnew" in self.request.POST:
            self.org_obj = None

        # comm method for both get and post
        self.prepare_form()

    @filter_hook
    def get_form_params(self):
        params = {'instance': self.org_obj}
        if self.request_method == 'post':
            params.update({'data': self.request.POST, 'files': self.request.FILES})
        return params

    @filter_hook
    def get_context(self):
        new_context = {
            'title': _('Change %s') % force_unicode(self.opts.verbose_name),
            'object_id': str(self.org_obj.pk),
        }
        context = super(UpdateAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_response(self, *args, **kwargs):
        context = self.get_context()
        context.update(kwargs or {})

        return TemplateResponse(self.request, self.change_form_template or [
            "admin/%s/%s/change_form.html" % (self.opts.app_label, self.opts.object_name.lower()),
            "admin/%s/change_form.html" % self.opts.app_label,
            "admin/change_form.html"
        ], context, current_app=self.admin_site.name)

    @filter_hook
    def post_response(self):
        """
        Determines the HttpResponse for the change_view stage.
        """
        opts = self.new_obj._meta
        obj = self.new_obj
        request = self.request

        # Handle proxy models automatically created by .only() or .defer().
        # Refs #14529
        verbose_name = opts.verbose_name
        module_name = opts.module_name
        if obj._deferred:
            opts_ = opts.proxy_for_model._meta
            verbose_name = opts_.verbose_name
            module_name = opts_.module_name

        pk_value = obj._get_pk_val()

        msg = _('The %(name)s "%(obj)s" was changed successfully.') % {'name': force_unicode(verbose_name), 'obj': force_unicode(obj)}
        if "_continue" in request.POST:
            self.message_user(msg + ' ' + _("You may edit it again below."))
            return HttpResponseRedirect(request.path)
        elif "_saveasnew" in request.POST:
            msg = _('The %(name)s "%(obj)s" was added successfully. You may edit it again below.') % {'name': force_unicode(verbose_name), 'obj': obj}
            self.message_user(msg)
            return HttpResponseRedirect(reverse('admin:%s_%s_change' %
                                        (opts.app_label, module_name),
                                        args=(pk_value,),
                                        current_app=self.admin_site.name))
        elif "_addanother" in request.POST:
            self.message_user(msg + ' ' + (_("You may add another %s below.") % force_unicode(verbose_name)))
            return HttpResponseRedirect(reverse('admin:%s_%s_add' %
                                        (opts.app_label, module_name),
                                        current_app=self.admin_site.name))
        else:
            self.message_user(msg)
            # Figure out where to redirect. If the user has change permission,
            # redirect to the change-list page for this object. Otherwise,
            # redirect to the admin index.
            if self.has_change_permission(None):
                post_url = reverse('admin:%s_%s_changelist' %
                                   (opts.app_label, module_name),
                                   current_app=self.admin_site.name)
            else:
                post_url = reverse('admin:index',
                                   current_app=self.admin_site.name)
            return HttpResponseRedirect(post_url)




