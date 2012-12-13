import re
from django import forms
from django.template import loader
from django.contrib.formtools.wizard.storage import get_storage
from django.contrib.formtools.wizard.forms import ManagementForm
from django.contrib.formtools.wizard.views import SessionWizardView as BaseWizardView, StepsHelper
from django.forms import ValidationError
from django.forms.models import modelform_factory
from django.utils.decorators import classonlymethod
from exadmin.sites import site
from exadmin.views import BaseAdminPlugin, ModelFormAdminView


class WizardView(BaseWizardView):

    admin_view = None
    plugin = None

    @classonlymethod
    def as_view(cls, *args, **kwargs):
        initkwargs = cls.get_initkwargs(*args, **kwargs)
        return cls(**initkwargs)

    def inti_request(self, request, *args, **kwargs):
        # add the storage engine to the current wizardview instance
        self.prefix = self.get_prefix(*args, **kwargs)
        self.storage = get_storage(self.storage_name, self.prefix, request,
            getattr(self, 'file_storage', None))
        self.steps = StepsHelper(self)

    def get_form_prefix(self, step=None, form=None):
        if step is None:
            step = self.steps.current
        new = re.sub('(((?<=[a-z])[A-Z])|([A-Z](?![A-Z]|$)))', '_\\1', str(step))
        return new.lower().strip('_').replace(' ', '')

class WizardFormPlugin(BaseAdminPlugin):

    wizard_form_list = None

    def _form_list(self):
        return [(name, modelform_factory(self.model, form=forms.ModelForm, \
            fields=fields, formfield_callback=self.admin_view.formfield_for_dbfield)) \
            for name, fields in self.wizard_form_list]

    def init_request(self, *args, **kwargs):
        if self.wizard_form_list:
            wizard_view = WizardView.as_view(form_list=self._form_list(), plugin=self, admin_view=self.admin_view)
            wizard_view.inti_request(self.request)
            self.storage = wizard_view.storage
            self.steps = wizard_view.steps
            self.wizard_view = wizard_view
            self.wizard_goto_step = False
        else:
            self.wizard_view = None

    def instance_forms(self, __):
        if not self.wizard_view:
            return __()

        if self.request.method == 'GET':
            self.storage.reset()
            self.storage.current_step = self.steps.first

            self.admin_view.form_obj = self.wizard_view.get_form()
        else:
            # Look for a wizard_goto_step element in the posted data which
            # contains a valid step name. If one was found, render the requested
            # form. (This makes stepping back a lot easier).
            wizard_goto_step = self.request.POST.get('wizard_goto_step', None)
            if wizard_goto_step and wizard_goto_step in self.wizard_view.get_form_list():
                self.storage.current_step = wizard_goto_step
                self.admin_view.form_obj = self.wizard_view.get_form(
                    data=self.storage.get_step_data(self.steps.current),
                    files=self.storage.get_step_files(self.steps.current))
                self.wizard_goto_step = True
                return

            # Check if form was refreshed
            management_form = ManagementForm(self.request.POST, prefix=self.wizard_view.prefix)
            if not management_form.is_valid():
                raise ValidationError(
                    'ManagementForm data is missing or has been tampered.')

            form_current_step = management_form.cleaned_data['current_step']
            if (form_current_step != self.steps.current and
                    self.storage.current_step is not None):
                # form refreshed, change current step
                self.storage.current_step = form_current_step

            # get the form for the current step
            self.admin_view.form_obj = self.wizard_view.get_form(data=self.request.POST, files=self.request.FILES)

    def valid_forms(self, __):
        if self.wizard_view and self.wizard_goto_step:
            return False
        return __()
    
    def _done(self):
        form = self.admin_view.form_obj
        self.new_obj = form.save(commit=True)
        #form.save_m2m()
        self.storage.reset()

    def save_forms(self, __):
        if not self.wizard_view:
            return __()

        # if the form is valid, store the cleaned data and files.
        self.storage.set_step_data(self.steps.current, self.wizard_view.process_step(self.admin_view.form_obj))
        self.storage.set_step_files(self.steps.current, self.wizard_view.process_step_files(self.admin_view.form_obj))

        # check if the current step is the last step
        if self.steps.current == self.steps.last:
            # no more steps, render done view
            return self._done()

    def save_models(self, __):
        if not self.wizard_view:
            return __()

    def save_related(self, __):
        if not self.wizard_view:
            return __()

    def get_response(self, response):
        if self.wizard_view:
            self.storage.update_response(response)
        return response

    def post_response(self, __):
        if not self.wizard_view:
            return __()

        if self.steps.current == self.steps.last:
            return __()

        # get the form instance based on the data from the storage backend
        # (if available).
        next_step = self.steps.next
        self.admin_view.form_obj = self.wizard_view.get_form(next_step,
            data=self.storage.get_step_data(next_step),
            files=self.storage.get_step_files(next_step))

        self.admin_view.setup_forms()

        # change the stored current step
        self.storage.current_step = next_step

        return self.admin_view.get_response()

    def block_after_fieldsets(self, context, nodes):
        if self.wizard_view:
            context.update(self.storage.extra_data)
            context['wizard'] = {
                'steps': self.steps,
                'management_form': ManagementForm(prefix=self.wizard_view.prefix, initial={
                    'current_step': self.steps.current,
                }),
            }
            nodes.append(loader.render_to_string('admin/blocks/wizard.html', context_instance=context))

site.register_plugin(WizardFormPlugin, ModelFormAdminView)