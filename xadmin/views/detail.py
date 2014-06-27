# coding=utf-8
import copy

from django import forms
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.db import models
from django.forms.models import modelform_factory
from django.http import Http404
from django.template import loader
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode, smart_unicode
from django.utils.html import escape
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext as _
from django.utils.html import conditional_escape
from xadmin.layout import FormHelper, Layout, Fieldset, Container, Column, Field, Col, TabHolder
from xadmin.util import unquote, lookup_field, display_for_field, boolean_icon, label_for_field

from base import ModelAdminView, filter_hook, csrf_protect_m

# Text to display within change-list table cells if the value is blank.
EMPTY_CHANGELIST_VALUE = _('Null')


class ShowField(Field):
    template = "xadmin/layout/field_value.html"

    def __init__(self, callback, *args, **kwargs):
        super(ShowField, self).__init__(*args)

        if 'attrs' in kwargs:
            self.attrs = kwargs.pop('attrs')
        if 'wrapper_class' in kwargs:
            self.wrapper_class = kwargs.pop('wrapper_class')

        self.results = [(field, callback(field)) for field in self.fields]

    def render(self, form, form_style, context):
        if hasattr(self, 'wrapper_class'):
            context['wrapper_class'] = self.wrapper_class

        if self.attrs:
            if 'detail-class' in self.attrs:
                context['input_class'] = self.attrs['detail-class']
            elif 'class' in self.attrs:
                context['input_class'] = self.attrs['class']

        html = ''
        for field, result in self.results:
            context['result'] = result
            if field in form.fields:
                if form.fields[field].widget != forms.HiddenInput:
                    context['field'] = form[field]
                    html += loader.render_to_string(self.template, context)
            else:
                context['field'] = field
                html += loader.render_to_string(self.template, context)
        return html


class ResultField(object):

    def __init__(self, obj, field_name, admin_view=None):
        self.text = '&nbsp;'
        self.wraps = []
        self.allow_tags = False
        self.obj = obj
        self.admin_view = admin_view
        self.field_name = field_name
        self.field = None
        self.attr = None
        self.label = None
        self.value = None

        self.init()

    def init(self):
        self.label = label_for_field(self.field_name, self.obj.__class__,
                                     model_admin=self.admin_view,
                                     return_attr=False
                                     )
        try:
            f, attr, value = lookup_field(
                self.field_name, self.obj, self.admin_view)
        except (AttributeError, ObjectDoesNotExist):
            self.text
        else:
            if f is None:
                self.allow_tags = getattr(attr, 'allow_tags', False)
                boolean = getattr(attr, 'boolean', False)
                if boolean:
                    self.allow_tags = True
                    self.text = boolean_icon(value)
                else:
                    self.text = smart_unicode(value)
            else:
                if isinstance(f.rel, models.ManyToOneRel):
                    self.text = getattr(self.obj, f.name)
                else:
                    self.text = display_for_field(value, f)
            self.field = f
            self.attr = attr
            self.value = value

    @property
    def val(self):
        text = mark_safe(
            self.text) if self.allow_tags else conditional_escape(self.text)
        if force_unicode(text) == '' or text == 'None' or text == EMPTY_CHANGELIST_VALUE:
            text = mark_safe(
                '<span class="text-muted">%s</span>' % EMPTY_CHANGELIST_VALUE)
        for wrap in self.wraps:
            text = mark_safe(wrap % text)
        return text


def replace_field_to_value(layout, cb):
    for i, lo in enumerate(layout.fields):
        if isinstance(lo, Field) or issubclass(lo.__class__, Field):
            layout.fields[i] = ShowField(
                cb, *lo.fields, attrs=lo.attrs, wrapper_class=lo.wrapper_class)
        elif isinstance(lo, basestring):
            layout.fields[i] = ShowField(cb, lo)
        elif hasattr(lo, 'get_field_names'):
            replace_field_to_value(lo, cb)


class DetailAdminView(ModelAdminView):
    """
    显示 Model 详细信息的 AdminView. 该 View 页面只能用来查看数据内容, 不能用来修改数据.
    该 View 显示各字段的布局跟 :class:`xadmin.views.edit.ModelFormAdminView` 一致.

    **Option属性**

        .. autoattribute:: detail_layout
        .. autoattribute:: detail_show_all
        .. autoattribute:: detail_template

    **实例属性**

        .. attribute:: obj

            即将被删除的对象
    """

    form = forms.ModelForm
    #: 详情页面的 Layout 对象，是一个标准的 Crispy Form Layout 对象。使用 Layout 可以方便的定义整个页面的结构。
    #  有关 Crispy Form 可以参考其文档 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/layouts.html>`_
    #  使用实例可以参看 :attr:`xadmin.views.edit.ModelFormAdminView.form_layout`
    detail_layout = None
    #: 是否显示所有字段的内容, 默认为 ``True`` . 如果为 ``True`` 则会显示 Layout 中没有列出的字段, 否则会隐藏这些字段
    detail_show_all = True
    #: 详情页面的模板文件
    detail_template = None
    form_layout = None

    def init_request(self, object_id, *args, **kwargs):
        """
        初始化操作。根据传入的 ``object_id`` 取得要被显示的数据对象，而后进行权限判断, 如果没有数据查看权限会显示禁止页面.
        """
        self.obj = self.get_object(unquote(object_id))

        # 须有查看权限
        if not self.has_view_permission(self.obj):
            raise PermissionDenied

        if self.obj is None:
            raise Http404(
                _('%(name)s object with primary key %(key)r does not exist.') %
                {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})
        self.org_obj = self.obj

    @filter_hook
    def get_form_layout(self):
        """
        返回 Form Layout ，如果您设置了 :attr:`detail_layout` 属性，则使用 :attr:`form_layout` 属性，如果都没有该方法会自动生成 Form Layout 。
        有关 Form Layout 的更多信息可以参看 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/layouts.html>`_
        设置 Form Layout 可以非常灵活的显示页面的各个元素
        """
        # 复制避免修改属性值
        layout = copy.deepcopy(self.detail_layout or self.form_layout)

        if layout is None:
            layout = Layout(Container(Col('full',
                                          Fieldset(
                                              "", *self.form_obj.fields.keys(),
                                              css_class="unsort no_title"), horizontal=True, span=12)
                                      ))
        elif type(layout) in (list, tuple) and len(layout) > 0:
            # 如果设置的 layout 是一个列表，那么按以下方法生成
            if isinstance(layout[0], Column):
                fs = layout
            elif isinstance(layout[0], (Fieldset, TabHolder)):
                fs = (Col('full', *layout, horizontal=True, span=12),)
            else:
                fs = (
                    Col('full', Fieldset("", *layout, css_class="unsort no_title"), horizontal=True, span=12),)

            layout = Layout(Container(*fs))

            if self.detail_show_all:
                # 显示没有在 Layout 中出现的字段
                rendered_fields = [i[1] for i in layout.get_field_names()]
                container = layout[0].fields
                other_fieldset = Fieldset(_(u'Other Fields'), *[
                                          f for f in self.form_obj.fields.keys() if f not in rendered_fields])

                if len(other_fieldset.fields):
                    if len(container) and isinstance(container[0], Column):
                        container[0].fields.append(other_fieldset)
                    else:
                        container.append(other_fieldset)

        return layout

    @filter_hook
    def get_model_form(self, **kwargs):
        """
        根据 Model 返回 Form 类，用来显示表单。
        """
        if self.exclude is None:
            exclude = []
        else:
            exclude = list(self.exclude)
        if self.exclude is None and hasattr(self.form, '_meta') and self.form._meta.exclude:
            # 如果 :attr:`~xadmin.views.base.ModelAdminView.exclude` 是 None，并且 form 的 Meta.exclude 不为空，
            # 则使用 form 的 Meta.exclude
            exclude.extend(self.form._meta.exclude)
        # 如果 exclude 是空列表，那么就设为 None
        exclude = exclude or None
        defaults = {
            "form": self.form,
            "fields": self.fields and list(self.fields) or None,
            "exclude": exclude,
        }
        defaults.update(kwargs)
        return modelform_factory(self.model, **defaults)

    @filter_hook
    def get_form_helper(self):
        """
        取得 Crispy Form 需要的 FormHelper。具体信息可以参看 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/tags.html#crispy-tag>`_ 
        """
        helper = FormHelper()
        helper.form_tag = False
        layout = self.get_form_layout()
        # 替换所有的字段为 ShowField
        replace_field_to_value(layout, self.get_field_result)
        helper.add_layout(layout)
        helper.filter(
            basestring, max_level=20).wrap(ShowField, admin_view=self)
        return helper

    @csrf_protect_m
    @filter_hook
    def get(self, request, *args, **kwargs):
        form = self.get_model_form()
        self.form_obj = form(instance=self.obj)
        helper = self.get_form_helper()
        if helper:
            self.form_obj.helper = helper

        return self.get_response()

    @filter_hook
    def get_context(self):
        """
        **Context Params** :

            ``form`` : 用于显示数据的 Form 对象

            ``object`` : 要显示的 Model 对象
        """
        new_context = {
            'title': _('%s Detail') % force_unicode(self.opts.verbose_name),
            'form': self.form_obj,

            'object': self.obj,

            'has_change_permission': self.has_change_permission(self.obj),
            'has_delete_permission': self.has_delete_permission(self.obj),

            'content_type_id': ContentType.objects.get_for_model(self.model).id,
        }

        context = super(DetailAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_breadcrumb(self):
        bcs = super(DetailAdminView, self).get_breadcrumb()
        item = {'title': force_unicode(self.obj)}
        if self.has_view_permission():
            item['url'] = self.model_admin_url('detail', self.obj.pk)
        bcs.append(item)
        return bcs

    @filter_hook
    def get_media(self):
        """
        返回列表页面的 Media, 该页面添加了 ``form.css`` 文件
        """
        media = super(DetailAdminView, self).get_media()
        media = media + self.form_obj.media
        media.add_css({'screen': [self.static('xadmin/css/xadmin.form.css')]})
        return media

    @filter_hook
    def get_field_result(self, field_name):
        """
        返回包含该字段内容的 :class:`ResultField` 实例.
        """
        return ResultField(self.obj, field_name, self)

    @filter_hook
    def get_response(self, *args, **kwargs):
        """
        返回 HttpResponse , 插件可以复写该方法返回特定的 HttpResponse
        """
        context = self.get_context()
        context.update(kwargs or {})

        return TemplateResponse(self.request, self.detail_template or
                                self.get_template_list(
                                    'views/model_detail.html'),
                                context, current_app=self.admin_site.name)


class DetailAdminUtil(DetailAdminView):
    """
    工具类，主要用于在其他页面显示数据内容，用于很多显示内容的插件中，使用示例::

        def some_func(self):
            detail_view = self.get_model_view(DetailAdminUtil, self.model, obj)
            name_value = detail_view.get_field_result('name')

    """
    def init_request(self, obj):
        self.obj = obj
        self.org_obj = obj
