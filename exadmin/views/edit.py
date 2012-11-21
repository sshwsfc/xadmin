
from django.contrib.admin.util import unquote, flatten_fieldsets
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.db import models, transaction
from django.forms.models import modelform_factory
from django.http import Http404, HttpResponse, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.utils.encoding import force_unicode
from django.utils.html import escape, escapejs
from django.utils.translation import ugettext as _
from django.views.decorators.csrf import csrf_protect
from django.contrib.admin import widgets
from django.contrib.admin.templatetags.admin_static import static
from django import forms

from exadmin import helpers
from base import ModelAdminView, filter_hook, action_hook

HORIZONTAL, VERTICAL = 1, 2
# returns the <ul> class for a given radio_admin field
get_ul_class = lambda x: 'radiolist%s' % ((x == HORIZONTAL) and ' inline' or '')

# Defaults for formfield_overrides. ModelAdmin subclasses can change this
# by adding to ModelAdmin.formfield_overrides.

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

csrf_protect_m = method_decorator(csrf_protect)

class ModelFormAdminView(ModelAdminView):

    raw_id_fields = ()
    fieldsets = None
    form = forms.ModelForm
    radio_fields = {}
    prepopulated_fields = {}
    formfield_overrides = {}
    readonly_fields = ()

    save_as = False
    save_on_top = False

    add_form_template = None
    change_form_template = None

    def formfield_for_dbfield(self, db_field, **kwargs):
        """
        Hook for specifying the form Field instance for a given database Field
        instance.

        If kwargs are given, they're passed to the form Field's constructor.
        """

        # If the field specifies choices, we don't need to look for special
        # admin widgets - we just need to use a select widget of some kind.
        if db_field.choices:
            return self.formfield_for_choice_field(db_field, **kwargs)

        # ForeignKey or ManyToManyFields
        if isinstance(db_field, (models.ForeignKey, models.ManyToManyField)):
            # Combine the field kwargs with any options for formfield_overrides.
            # Make sure the passed in **kwargs override anything in
            # formfield_overrides because **kwargs is more specific, and should
            # always win.
            if db_field.__class__ in self.formfield_overrides:
                kwargs = dict(self.formfield_overrides[db_field.__class__], **kwargs)

            # Get the correct formfield.
            if isinstance(db_field, models.ForeignKey):
                formfield = self.formfield_for_foreignkey(db_field, **kwargs)
            elif isinstance(db_field, models.ManyToManyField):
                formfield = self.formfield_for_manytomany(db_field, **kwargs)

            # For non-raw_id fields, wrap the widget with a wrapper that adds
            # extra HTML -- the "add other" interface -- to the end of the
            # rendered output. formfield can be None if it came from a
            # OneToOneField with parent_link=True or a M2M intermediary.
            if formfield and db_field.name not in self.raw_id_fields:
                # related_modeladmin = self.admin_site._registry.get(
                #                                             db_field.rel.to)
                # can_add_related = bool(related_modeladmin and
                #             related_modeladmin.has_add_permission())
                can_add_related = False
                formfield.widget = widgets.RelatedFieldWidgetWrapper(
                            formfield.widget, db_field.rel, self.admin_site,
                            can_add_related=can_add_related)

            return formfield

        # If we've got overrides for the formfield defined, use 'em. **kwargs
        # passed to formfield_for_dbfield override the defaults.
        for klass in db_field.__class__.mro():
            if klass in self.formfield_overrides:
                kwargs = dict(self.formfield_overrides[klass], **kwargs)
                return db_field.formfield(**kwargs)

        # For any other type of field, just call its formfield() method.
        return db_field.formfield(**kwargs)

    def formfield_for_choice_field(self, db_field, **kwargs):
        """
        Get a form Field for a database Field that has declared choices.
        """
        # If the field is named as a radio_field, use a RadioSelect
        if db_field.name in self.radio_fields:
            # Avoid stomping on custom widget/choices arguments.
            if 'widget' not in kwargs:
                kwargs['widget'] = widgets.AdminRadioSelect(attrs={
                    'class': get_ul_class(self.radio_fields[db_field.name]),
                })
            if 'choices' not in kwargs:
                kwargs['choices'] = db_field.get_choices(
                    include_blank = db_field.blank,
                    blank_choice=[('', _('None'))]
                )
        return db_field.formfield(**kwargs)

    def formfield_for_foreignkey(self, db_field, **kwargs):
        """
        Get a form Field for a ForeignKey.
        """
        db = kwargs.get('using')
        if db_field.name in self.raw_id_fields:
            kwargs['widget'] = widgets.ForeignKeyRawIdWidget(db_field.rel,
                                    self.admin_site, using=db)
        elif db_field.name in self.radio_fields:
            kwargs['widget'] = widgets.AdminRadioSelect(attrs={
                'class': get_ul_class(self.radio_fields[db_field.name]),
            })
            kwargs['empty_label'] = db_field.blank and _('None') or None

        return db_field.formfield(**kwargs)

    def formfield_for_manytomany(self, db_field, **kwargs):
        """
        Get a form Field for a ManyToManyField.
        """
        # If it uses an intermediary model that isn't auto created, don't show
        # a field in admin.
        if not db_field.rel.through._meta.auto_created:
            return None
        db = kwargs.get('using')

        if db_field.name in self.raw_id_fields:
            kwargs['widget'] = widgets.ManyToManyRawIdWidget(db_field.rel,
                                    self.admin_site, using=db)
            kwargs['help_text'] = ''
        elif db_field.name in (list(self.filter_vertical) + list(self.filter_horizontal)):
            kwargs['widget'] = widgets.FilteredSelectMultiple(db_field.verbose_name, (db_field.name in self.filter_vertical))

        return db_field.formfield(**kwargs)


    @action_hook
    def prepare_form(self):
        self.model_form = self.get_model_form()

    @action_hook
    def instance_forms(self):
        self.form_obj = self.model_form(**self.get_form_params())

    @filter_hook
    def valid_forms(self):
        return self.form_obj.is_valid()

    @filter_hook
    def get_model_form(self):
        """
        Returns a Form class for use in the admin add view. This is used by
        add_view and change_view.
        """
        if self.declared_fieldsets:
            fields = flatten_fieldsets(self.declared_fieldsets)
        else:
            fields = None
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
            "fields": fields,
            "exclude": exclude,
            "formfield_callback": self.formfield_for_dbfield,
        }
        #defaults.update(self.kwargs)
        return modelform_factory(self.model, **defaults)

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

    def _declared_fieldsets(self):
        if self.fieldsets:
            return self.fieldsets
        elif self.fields:
            return [(None, {'fields': self.fields})]
        return None
    declared_fieldsets = property(_declared_fieldsets)

    @filter_hook
    def get_fieldsets(self):
        "Hook for specifying fieldsets for the add form."
        if self.declared_fieldsets:
            return self.declared_fieldsets
        form = self.get_model_form()
        fields = form.base_fields.keys() + list(self.get_readonly_fields())
        return [(None, {'fields': fields})]

    @action_hook
    def save_forms(self):
        self.new_obj = self.form_obj.save(commit=False)

    @action_hook
    def save_models(self):
        self.new_obj.save()

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
            return self.post_response()

        return self.get_response()

    @filter_hook
    def get_context(self):
        form = self.form_obj

        adminForm = helpers.AdminForm(form, list(self.get_fieldsets()),
            self.get_prepopulated_fields(),
            self.get_readonly_fields(),
            model_admin=self)

        media = self.media + adminForm.media
        ordered_objects = self.opts.get_ordered_objects()

        new_context = {
            'adminform': adminForm,
            'is_popup': "_popup" in self.request.REQUEST,
            'media': media,
            'original': self.org_obj,
            'show_delete': self.org_obj is not None,
            'add': self.org_obj is None,
            'change': self.org_obj is not None,
            'errors': helpers.AdminErrorList(form, []),
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
    def get_media(self):
        media = super(ModelFormAdminView, self).get_media()
        media.add_js([static('exadmin/js/form.js')])
        media.add_css({'screen': [static('exadmin/css/form.css')]})
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
    def post_response(self, post_url_continue='../%s/'):
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
            if "_popup" in request.POST:
                post_url_continue += "?_popup=1"
            return HttpResponseRedirect(post_url_continue % pk_value)

        if "_popup" in request.POST:
            return HttpResponse(
                '<!DOCTYPE html><html><head><title></title></head><body>'
                '<script type="text/javascript">opener.dismissAddAnotherPopup(window, "%s", "%s");</script></body></html>' % \
                # escape() calls force_unicode.
                (escape(pk_value), escapejs(obj)))
        elif "_addanother" in request.POST:
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

        # if self.request.method == 'POST' and "_saveasnew" in self.request.POST:
        #     return self.add_view(form_url=reverse('admin:%s_%s_add' %
        #                             (self.opts.app_label, self.opts.module_name),
        #                             current_app=self.admin_site.name))

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
            if "_popup" in request.REQUEST:
                return HttpResponseRedirect(request.path + "?_popup=1")
            else:
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




