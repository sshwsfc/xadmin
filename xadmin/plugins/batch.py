# coding=utf-8
from django.core.exceptions import PermissionDenied
from django.forms.models import modelform_factory
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode
from django.utils.translation import ugettext as _, ugettext_lazy
from xadmin.layout import FormHelper, Layout, Fieldset, Container
from xadmin.plugins.actions import BaseActionView, ACTION_CHECKBOX_NAME
from xadmin.util import model_ngettext
from xadmin.views.base import filter_hook
from xadmin.views.edit import ModelFormAdminView


class BatchChangeAction(BaseActionView):

    action_name = "change_selected"
    description = ugettext_lazy(
        u'Batch Change selected %(verbose_name_plural)s')

    batch_change_form_template = None

    model_perm = 'change'

    batch_fields = []

    def change_models(self, queryset):
        n = queryset.count()
        if n:
            queryset.delete()
            self.message_user(_("Successfully deleted %(count)d %(items)s.") % {
                "count": n, "items": model_ngettext(self.opts, n)
            }, 'success')

    def get_change_form(self):
        edit_view = self.get_model_view(ModelFormAdminView, self.model)

        defaults = {
            "form": edit_view.form,
            "fields": self.batch_fields,
            "formfield_callback": edit_view.formfield_for_dbfield,    # 设置生成表单字段的回调函数
        }
        # 使用 modelform_factory 生成 Form 类
        return modelform_factory(self.model, **defaults)

    def do_action(self, queryset):
        if not self.has_change_permission():
            raise PermissionDenied

        form_class = self.get_change_form()

        if self.request.POST.get('post'):
            self.form_obj = form_class(
                data=self.request.POST, files=self.request.FILES)

            return None
        else:
            self.form_obj = form_class()

        helper = FormHelper()
        helper.form_tag = False  # 默认不需要 crispy 生成 form_tag
        helper.add_layout(Layout(Container(
            Fieldset("", *self.form_obj.fields.keys(), css_class="unsort no_title"), css_class="form-horizontal"
        )))
        self.form_obj.helper = helper

        if len(queryset) == 1:
            objects_name = force_unicode(self.opts.verbose_name)
        else:
            objects_name = force_unicode(self.opts.verbose_name_plural)

        context = self.get_context()
        context.update({
            "title": _("Change %s") % objects_name,
            'form': self.form_obj,
            'queryset': queryset,
            "opts": self.opts,
            "app_label": self.app_label,
            'action_checkbox_name': ACTION_CHECKBOX_NAME,
        })

        return TemplateResponse(self.request, self.batch_change_form_template or
                                self.get_template_list('views/batch_change_form.html'), context, current_app=self.admin_site.name)

    @filter_hook
    def get_media(self):
        media = super(BatchChangeAction, self).get_media()
        media = media + self.form_obj.media + self.vendor(
            'xadmin.page.form.js', 'xadmin.form.css')
        return media
