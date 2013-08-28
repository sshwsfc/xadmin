# coding=utf-8
from django import forms
from django.core.urlresolvers import reverse
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import PermissionDenied
from django.template.response import TemplateResponse
from django.utils.decorators import method_decorator
from django.http import HttpResponseRedirect
from django.utils.html import escape
from django.utils.translation import ugettext as _
from django.views.decorators.debug import sensitive_post_parameters

from xadmin.sites import site
from xadmin.views.base import BaseAdminPlugin, BaseAdminView, csrf_protect_m
from xadmin.views.website import LoginView


class ResetPasswordSendView(BaseAdminView):
    
    need_site_permission = False

    password_reset_form = PasswordResetForm
    password_reset_template = 'xadmin/auth/password_reset/form.html'
    password_reset_token_generator = default_token_generator

    password_reset_from_email = None
    password_reset_email_template = 'xadmin/auth/password_reset/email.html'
    password_reset_subject_template = None

    def get(self, request, *args, **kwargs):
        context = super(ResetPasswordSendView, self).get_context()
        context['form'] = self.password_reset_form()

        return TemplateResponse(request, self.password_reset_template, context,
                                current_app=self.admin_site.name)

    @csrf_protect_m
    def post(self, request, *args, **kwargs):
        form = self.password_reset_form(request.POST)

        if form.is_valid():
            opts = {
                'use_https': request.is_secure(),
                'token_generator': self.password_reset_token_generator,
                'from_email': self.password_reset_from_email,
                'email_template_name': self.password_reset_email_template,
                'subject_template_name': self.password_reset_subject_template,
                'request': request,
                'domain_override': request.get_host()
            }
            form.save(**opts)

            return HttpResponseRedirect(self.get_admin_url('xadmin_password_reset_done'))

site.register_view(r'^xadmin/password_reset/$', ResetPasswordSendView, name='xadmin_password_reset')

class ResetLinkPlugin(BaseAdminPlugin):

    def block_form_bottom(self, context, nodes):
        reset_link = self.get_admin_url('xadmin_password_reset')
        return '<div class="text-info" style="margin-top:15px;"><a href="%s"><i class="icon-question-sign"></i> %s</a></div>' % (reset_link, _('Forgotten your password or username?'))

site.register_plugin(ResetLinkPlugin, LoginView)

