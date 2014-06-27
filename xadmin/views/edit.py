# coding=utf-8
import copy

from django import forms
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import PermissionDenied
from django.db import models, transaction
from django.forms.models import modelform_factory
from django.http import Http404, HttpResponseRedirect
from django.template.response import TemplateResponse
from django.utils.encoding import force_unicode
from django.utils.html import escape
from django.template import loader
from django.utils.translation import ugettext as _
from xadmin import widgets
from xadmin.layout import FormHelper, Layout, Fieldset, TabHolder, Container, Column, Col, Field
from xadmin.util import unquote
from xadmin.views.detail import DetailAdminUtil

from base import ModelAdminView, filter_hook, csrf_protect_m

#: xadmin在显示 Form 时，系统默认的 DB Field 对应的 Form Field 的属性。
FORMFIELD_FOR_DBFIELD_DEFAULTS = {
    models.DateTimeField: {
        'form_class': forms.SplitDateTimeField,
        'widget': widgets.AdminSplitDateTime
    },
    models.DateField: {'widget': widgets.AdminDateWidget},
    models.TimeField: {'widget': widgets.AdminTimeWidget},
    models.TextField: {'widget': widgets.AdminTextareaWidget},
    models.URLField: {'widget': widgets.AdminURLFieldWidget},
    models.IntegerField: {'widget': widgets.AdminIntegerFieldWidget},
    models.BigIntegerField: {'widget': widgets.AdminIntegerFieldWidget},
    models.CharField: {'widget': widgets.AdminTextInputWidget},
    models.IPAddressField: {'widget': widgets.AdminTextInputWidget},
    models.ImageField: {'widget': widgets.AdminFileWidget},
    models.FileField: {'widget': widgets.AdminFileWidget},
    models.ForeignKey: {'widget': widgets.AdminSelectWidget},
    models.OneToOneField: {'widget': widgets.AdminSelectWidget},
    models.ManyToManyField: {'widget': widgets.AdminSelectMultiple},
}


class ReadOnlyField(Field):
    """
    crispy Field，使用 :class:`~xadmin.views.detail.DetailAdminView` 仅显示该字段的内容，不能编辑。
    """
    template = "xadmin/layout/field_value.html"

    def __init__(self, *args, **kwargs):
        self.detail = kwargs.pop('detail')
        super(ReadOnlyField, self).__init__(*args, **kwargs)

    def render(self, form, form_style, context):
        html = ''
        for field in self.fields:
            result = self.detail.get_field_result(field)
            field = {'auto_id': field}    #: 设置 field id
            html += loader.render_to_string(
                self.template, {'field': field, 'result': result})
        return html


class ModelFormAdminView(ModelAdminView):
    """
    用于添加或修改数据的 AdminView，该类是一个基类，提供了数据表单显示及修改等通用功能，被 :class:`CreateAdminView` 及 :class:`UpdateAdminView` 继承

    **Option 属性**

        .. autoattribute:: form
        .. autoattribute:: formfield_overrides
        .. autoattribute:: readonly_fields
        .. autoattribute:: style_fields
        .. autoattribute:: relfield_style

        .. autoattribute:: save_as
        .. autoattribute:: save_on_top

        .. autoattribute:: add_form_template
        .. autoattribute:: change_form_template

        .. autoattribute:: form_layout
    """
    form = forms.ModelForm     #: 使用 Model 生成 Form 的基本 Form 类，默认为 django.forms.ModelForm
    formfield_overrides = {}
    """
    可以指定某种类型的 DB Field，使用指定的 Form Field 属性，例如::

        class AtricleAdmin(object):
            formfield_overrides = {
                models.FileField:{'widget': mywidgets.XFileWidget},
            }

    这样，显示所有 FileField 字段时，都会使用 ``mywidgets.XFileWidget`` 来显示
    """
    readonly_fields = ()       #: 只读的字段，这些字段不能被编辑
    style_fields = {}
    """
    指定 Field 的 Style， Style一般用来实现同一种类型的字段的不同效果，例如同样是 radio button，有普通及``inline``两种 Style。
    通常 xadmin 针对表单的插件会实现更多的 Field Style。您使用这些插件后，只要方便的将想要使用插件效果的字段设置成插件实现的 Style 即可，例如::

        class AtricleAdmin(object):
            style_fields = {"content": "rich-textarea"}

    ``rich-textarea`` 可能是某插件提供的 Style，这样显示 ``content`` 字段时就会使用该插件的效果了
    """
    exclude = None
    relfield_style = None      #: 当 Model 是其他 Model 的 ref model 时，其他 Model 在显示本 Model 的字段时使用的 Field Style

    save_as = False            #: 是否显示 ``另存为`` 按钮
    save_on_top = False        #: 是否在页面上面显示按钮组

    add_form_template = None     #: 添加页面的模板
    change_form_template = None  #: 修改页面的模板

    form_layout = None
    """
    页面 Form 的 Layout 对象，是一个标准的 Crispy Form Layout 对象。使用 Layout 可以方便的定义整个 Form 页面的结构。
    有关 Crispy Form 可以参考其文档 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/layouts.html>`_
    设置 form_layout 的示例::

        from xadmin.layout import Main, Side, Fieldset, Row, AppendedText

        class AtricleAdmin(object):
            form_layout = (
                Main(
                    Fieldset('Comm data',
                        'title', 'category'
                    ),
                    Inline(Log),
                    Fieldset('Details',
                        'short_title',
                        Row(AppendedText('file_size', 'MB'), 'author'),
                        'content'
                    ),
                ),
                Side(
                    Fieldset('Status',
                        'status',
                    ),
                )
            )
    
    有关 Layout 中元素的信息，可以参看文档 :ref:`form_layout`
    """

    def __init__(self, request, *args, **kwargs):
        overrides = FORMFIELD_FOR_DBFIELD_DEFAULTS.copy()
        # 将 :attr:`formfield_overrides` 替换系统默认值
        overrides.update(self.formfield_overrides)
        self.formfield_overrides = overrides
        super(ModelFormAdminView, self).__init__(request, *args, **kwargs)

    @filter_hook
    def formfield_for_dbfield(self, db_field, **kwargs):
        """
        生成表单时的回调方法，返回 Form Field。

        :param db_field: Model 的 DB Field
        """
        # 如果使用了非自动生成的 intermediary model 则不显示该字段
        if isinstance(db_field, models.ManyToManyField) and not db_field.rel.through._meta.auto_created:
            return None

        attrs = self.get_field_attrs(db_field, **kwargs)
        return db_field.formfield(**dict(attrs, **kwargs))

    @filter_hook
    def get_field_style(self, db_field, style, **kwargs):
        """
        根据 Field Style 返回 Form Field 属性。扩展插件可以过滤该方法，提供各种不同的 Style

        :param db_field: Model 的 DB Field

        :param style: 配置的 Field Style，该值来自于属性 :attr:`style_fields`
        """
        if style in ('radio', 'radio-inline') and (db_field.choices or isinstance(db_field, models.ForeignKey)):
            # fk 字段生成 radio 表单控件
            attrs = {'widget': widgets.AdminRadioSelect(
                attrs={'inline': style == 'radio-inline'})}
            if db_field.choices:
                attrs['choices'] = db_field.get_choices(
                    include_blank=db_field.blank,
                    blank_choice=[('', _('Null'))]
                )
            return attrs

        if style in ('checkbox', 'checkbox-inline') and isinstance(db_field, models.ManyToManyField):
            return {'widget': widgets.AdminCheckboxSelect(attrs={'inline': style == 'checkbox-inline'}),
                    'help_text': None}

    @filter_hook
    def get_field_attrs(self, db_field, **kwargs):
        """
        根据 DB Field 返回 Form Field 的属性，dict类型。

        :param db_field: Model 的 DB Field
        """
        if db_field.name in self.style_fields:
            # 如果设置了 Field Style，则返回 Style 的属性
            attrs = self.get_field_style(
                db_field, self.style_fields[db_field.name], **kwargs)
            if attrs:
                return attrs

        if hasattr(db_field, "rel") and db_field.rel:
            related_modeladmin = self.admin_site._registry.get(db_field.rel.to)
            # 如果字段是关联字段，并且关联字段的 ModelAdmin 设置了 :attr:`relfield_style` 属性，则使用该值作为 Field Style
            if related_modeladmin and hasattr(related_modeladmin, 'relfield_style'):
                attrs = self.get_field_style(
                    db_field, related_modeladmin.relfield_style, **kwargs)
                if attrs:
                    return attrs

        if db_field.choices:
            return {'widget': widgets.AdminSelectWidget}

        for klass in db_field.__class__.mro():
            # 根据 DB Field 的类，获取 Field 属性
            if klass in self.formfield_overrides:
                return self.formfield_overrides[klass].copy()

        return {}

    @filter_hook
    def prepare_form(self):
        """
        准备 Form，即调用 :meth:`get_model_form` 获取 form ，然后赋值给 :attr:`model_form` 属性
        """
        self.model_form = self.get_model_form()

    @filter_hook
    def instance_forms(self):
        """
        实例化 Form 对象，即使用 :meth:`get_form_datas` 返回的值初始化 Form，实例化的 Form 对象赋值为 :attr:`form_obj` 属性
        """
        self.form_obj = self.model_form(**self.get_form_datas())

    def setup_forms(self):
        """
        配置 Form。主要是
        """
        helper = self.get_form_helper()
        if helper:
            self.form_obj.helper = helper

    @filter_hook
    def valid_forms(self):
        """
        验证 Form 的数据合法性
        """
        return self.form_obj.is_valid()

    @filter_hook
    def get_model_form(self, **kwargs):
        """
        根据 Model 返回 Form 类，用来显示表单。
        """
        if self.exclude is None:
            exclude = []
        else:
            exclude = list(self.exclude)
        exclude.extend(self.get_readonly_fields())
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
            "formfield_callback": self.formfield_for_dbfield,    # 设置生成表单字段的回调函数
        }
        defaults.update(kwargs)
        # 使用 modelform_factory 生成 Form 类
        return modelform_factory(self.model, **defaults)

    @filter_hook
    def get_form_layout(self):
        """
        返回 Form Layout ，如果您设置了 :attr:`form_layout` 属性，则使用该属性，否则该方法会自动生成 Form Layout 。
        有关 Form Layout 的更多信息可以参看 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/layouts.html>`_
        设置 Form Layout 可以非常灵活的显示表单页面的各个元素
        """
        layout = copy.deepcopy(self.form_layout)
        fields = self.form_obj.fields.keys() + list(self.get_readonly_fields())

        if layout is None:
            layout = Layout(Container(Col('full',
                Fieldset("", *fields, css_class="unsort no_title"), horizontal=True, span=12)
            ))
        elif type(layout) in (list, tuple) and len(layout) > 0:
            # 如果设置的 layout 是一个列表，那么按以下方法生成
            if isinstance(layout[0], Column):
                fs = layout
            elif isinstance(layout[0], (Fieldset, TabHolder)):
                fs = (Col('full', *layout, horizontal=True, span=12),)
            else:
                fs = (Col('full', Fieldset("", *layout, css_class="unsort no_title"), horizontal=True, span=12),)

            layout = Layout(Container(*fs))

            rendered_fields = [i[1] for i in layout.get_field_names()]
            container = layout[0].fields
            other_fieldset = Fieldset(_(u'Other Fields'), *[f for f in fields if f not in rendered_fields])

            # 将所有没有显示的字段和在一个 Fieldset 里面显示
            if len(other_fieldset.fields):
                if len(container) and isinstance(container[0], Column):
                    # 把其他字段放在第一列显示
                    container[0].fields.append(other_fieldset)
                else:
                    container.append(other_fieldset)

        return layout

    @filter_hook
    def get_form_helper(self):
        """
        取得 Crispy Form 需要的 FormHelper。具体信息可以参看 `Crispy Form 文档 <http://django-crispy-forms.readthedocs.org/en/latest/tags.html#crispy-tag>`_ 
        """
        helper = FormHelper()
        helper.form_tag = False # 默认不需要 crispy 生成 form_tag
        helper.add_layout(self.get_form_layout())

        # 处理只读字段
        readonly_fields = self.get_readonly_fields()
        if readonly_fields:
            # 使用 :class:`xadmin.views.detail.DetailAdminUtil` 来显示只读字段的内容
            detail = self.get_model_view(
                DetailAdminUtil, self.model, self.form_obj.instance)
            for field in readonly_fields:
                # 替换只读字段
                helper[field].wrap(ReadOnlyField, detail=detail)

        return helper

    @filter_hook
    def get_readonly_fields(self):
        """
        返回只读字段，子类或 OptionClass 可以复写该方法
        """
        return self.readonly_fields

    @filter_hook
    def save_forms(self):
        """
        保存表单，赋值为 :attr:`new_obj` 属性，这时该对象还没有保存到数据库中，也没有 pk 生成
        """
        self.new_obj = self.form_obj.save(commit=False)

    @filter_hook
    def save_models(self):
        """
        保存数据到数据库中
        """
        self.new_obj.save()

    @filter_hook
    def save_related(self):
        """
        保存关联数据
        """
        self.form_obj.save_m2m()

    @csrf_protect_m
    @filter_hook
    def get(self, request, *args, **kwargs):
        """
        显示表单。具体的程序执行流程为:

            1. :meth:`prepare_form`

            2. :meth:`instance_forms`

                2.1 :meth:`get_form_datas`

            3. :meth:`setup_forms`

            4. :meth:`get_response`
        """
        self.instance_forms()
        self.setup_forms()

        return self.get_response()

    @csrf_protect_m
    @transaction.commit_on_success
    @filter_hook
    def post(self, request, *args, **kwargs):
        """
        保存表单数据。具体的程序执行流程为:

            1. :meth:`prepare_form`

            2. :meth:`instance_forms`

                2.1 :meth:`get_form_datas`

            3. :meth:`setup_forms`

            4. :meth:`valid_forms`

                4.1 :meth:`save_forms`

                4.2 :meth:`save_models`

                4.3 :meth:`save_related`

                4.4 :meth:`post_response`
        """
        self.instance_forms()
        self.setup_forms()

        if self.valid_forms():
            self.save_forms()
            self.save_models()
            self.save_related()
            response = self.post_response()
            if isinstance(response, basestring):
                return HttpResponseRedirect(response)
            else:
                return response

        return self.get_response()

    @filter_hook
    def get_context(self):
        """
        **Context Params**:

            ``form`` : Form 对象

            ``original`` : 要修改的原始数据对象

            ``show_delete`` : 是否显示删除项

            ``add`` : 是否是添加数据

            ``change`` : 是否是修改数据

            ``errors`` : Form 错误信息
        """
        add = self.org_obj is None
        change = self.org_obj is not None

        new_context = {
            'form': self.form_obj,
            'original': self.org_obj,
            'show_delete': self.org_obj is not None,
            'add': add,
            'change': change,
            'errors': self.get_error_list(),

            'has_add_permission': self.has_add_permission(),
            'has_view_permission': self.has_view_permission(),
            'has_change_permission': self.has_change_permission(self.org_obj),
            'has_delete_permission': self.has_delete_permission(self.org_obj),

            'has_file_field': True,  # FIXME - this should check if form or formsets have a FileField,
            'has_absolute_url': hasattr(self.model, 'get_absolute_url'),
            'form_url': '',
            'content_type_id': ContentType.objects.get_for_model(self.model).id,
            'save_as': self.save_as,
            'save_on_top': self.save_on_top,
        }

        # for submit line
        new_context.update({
            'onclick_attrib': '',
            'show_delete_link': (new_context['has_delete_permission']
                                 and (change or new_context['show_delete'])),
            'show_save_as_new': change and self.save_as,
            'show_save_and_add_another': new_context['has_add_permission'] and
                                (not self.save_as or add),
            'show_save_and_continue': new_context['has_change_permission'],
            'show_save': True
        })

        if self.org_obj and new_context['show_delete_link']:
            new_context['delete_url'] = self.model_admin_url(
                'delete', self.org_obj.pk)

        context = super(ModelFormAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_error_list(self):
        """
        获取表单的错误信息列表。
        """
        errors = forms.util.ErrorList()
        if self.form_obj.is_bound:
            errors.extend(self.form_obj.errors.values())
        return errors

    @filter_hook
    def get_media(self):
        return super(ModelFormAdminView, self).get_media() + self.form_obj.media + \
            self.vendor('xadmin.page.form.js', 'xadmin.form.css')


class CreateAdminView(ModelFormAdminView):
    """
    创建数据的 ModeAdminView 继承自 :class:`ModelFormAdminView` ，用于创建数据。
    """
    def init_request(self, *args, **kwargs):
        self.org_obj = None

        if not self.has_add_permission():
            raise PermissionDenied

        # comm method for both get and post
        self.prepare_form()

    @filter_hook
    def get_form_datas(self):
        """
        从 Request 中返回 Form 的初始化数据
        """
        if self.request_method == 'get':
            initial = dict(self.request.GET.items())
            for k in initial:
                try:
                    f = self.opts.get_field(k)
                except models.FieldDoesNotExist:
                    continue
                if isinstance(f, models.ManyToManyField):
                    # 如果是多对多的字段，则使用逗号分割
                    initial[k] = initial[k].split(",")
            return {'initial': initial}
        else:
            return {'data': self.request.POST, 'files': self.request.FILES}

    @filter_hook
    def get_context(self):
        """
        **Context Params**:

            ``title`` : 表单标题
        """
        new_context = {
            'title': _('Add %s') % force_unicode(self.opts.verbose_name),
        }
        context = super(CreateAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_breadcrumb(self):
        bcs = super(ModelFormAdminView, self).get_breadcrumb()
        item = {'title': _('Add %s') % force_unicode(self.opts.verbose_name)}
        if self.has_add_permission():
            item['url'] = self.model_admin_url('add')
        bcs.append(item)
        return bcs

    @filter_hook
    def get_response(self):
        """
        返回显示表单页面的 Response ，子类或是 OptionClass 可以复写该方法
        """
        context = self.get_context()
        context.update(self.kwargs or {})

        return TemplateResponse(
            self.request, self.add_form_template or self.get_template_list(
                'views/model_form.html'),
            context, current_app=self.admin_site.name)

    @filter_hook
    def post_response(self):
        """
        当成功保存数据后，会调用该方法返回 HttpResponse 或跳转地址
        """
        request = self.request

        msg = _(
            'The %(name)s "%(obj)s" was added successfully.') % {'name': force_unicode(self.opts.verbose_name),
                                                                 'obj': "<a class='alert-link' href='%s'>%s</a>" % (self.model_admin_url('change', self.new_obj._get_pk_val()), force_unicode(self.new_obj))}

        if "_continue" in request.REQUEST:
            self.message_user(
                msg + ' ' + _("You may edit it again below."), 'success')
            # 继续编辑
            return self.model_admin_url('change', self.new_obj._get_pk_val())

        if "_addanother" in request.REQUEST:
            self.message_user(msg + ' ' + (_("You may add another %s below.") % force_unicode(self.opts.verbose_name)), 'success')
            # 返回添加页面添加另外一个
            return request.path
        else:
            self.message_user(msg, 'success')

            # 如果没有查看列表的权限就跳转到主页
            if "_redirect" in request.REQUEST:
                return request.REQUEST["_redirect"]
            elif self.has_view_permission():
                return self.model_admin_url('changelist')
            else:
                return self.get_admin_url('index')


class UpdateAdminView(ModelFormAdminView):
    """
    修改数据的 ModeAdminView 继承自 :class:`ModelFormAdminView` ，用于修改数据。
    """
    def init_request(self, object_id, *args, **kwargs):
        self.org_obj = self.get_object(unquote(object_id))

        if not self.has_change_permission(self.org_obj):
            raise PermissionDenied

        if self.org_obj is None:
            raise Http404(_('%(name)s object with primary key %(key)r does not exist.') %
                          {'name': force_unicode(self.opts.verbose_name), 'key': escape(object_id)})

        # comm method for both get and post
        self.prepare_form()

    @filter_hook
    def get_form_datas(self):
        """
        获取 Form 数据
        """
        params = {'instance': self.org_obj}
        if self.request_method == 'post':
            params.update(
                {'data': self.request.POST, 'files': self.request.FILES})
        return params

    @filter_hook
    def get_context(self):
        """
        **Context Params**:

            ``title`` : 表单标题

            ``object_id`` : 修改的数据对象的 id
        """
        new_context = {
            'title': _('Change %s') % force_unicode(self.org_obj),
            'object_id': str(self.org_obj.pk),
        }
        context = super(UpdateAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_breadcrumb(self):
        bcs = super(ModelFormAdminView, self).get_breadcrumb()

        item = {'title': force_unicode(self.org_obj)}
        if self.has_change_permission():
            item['url'] = self.model_admin_url('change', self.org_obj.pk)
        bcs.append(item)

        return bcs

    @filter_hook
    def get_response(self, *args, **kwargs):
        context = self.get_context()
        context.update(kwargs or {})

        return TemplateResponse(
            self.request, self.change_form_template or self.get_template_list(
                'views/model_form.html'),
            context, current_app=self.admin_site.name)

    def post(self, request, *args, **kwargs):
        if "_saveasnew" in self.request.REQUEST:
            return self.get_model_view(CreateAdminView, self.model).post(request)
        return super(UpdateAdminView, self).post(request, *args, **kwargs)

    @filter_hook
    def post_response(self):
        """
        当成功修改数据后，会调用该方法返回 HttpResponse 或跳转地址
        """
        opts = self.new_obj._meta
        obj = self.new_obj
        request = self.request
        verbose_name = opts.verbose_name

        pk_value = obj._get_pk_val()

        msg = _('The %(name)s "%(obj)s" was changed successfully.') % {'name':
                                                                       force_unicode(verbose_name), 'obj': force_unicode(obj)}
        if "_continue" in request.REQUEST:
            self.message_user(
                msg + ' ' + _("You may edit it again below."), 'success')
            # 返回原页面继续编辑
            return request.path
        elif "_addanother" in request.REQUEST:
            self.message_user(msg + ' ' + (_("You may add another %s below.")
                              % force_unicode(verbose_name)), 'success')
            return self.model_admin_url('add')
        else:
            self.message_user(msg, 'success')
            # 如果没有查看列表的权限就跳转到主页
            if "_redirect" in request.REQUEST:
                return request.REQUEST["_redirect"]
            elif self.has_view_permission():
                change_list_url = self.model_admin_url('changelist')
                if 'LIST_QUERY' in self.request.session \
                and self.request.session['LIST_QUERY'][0] == self.model_info:
                    change_list_url += '?' + self.request.session['LIST_QUERY'][1]
                return change_list_url
            else:
                return self.get_admin_url('index')


class ModelFormAdminUtil(ModelFormAdminView):
    """
    工具类，主要用于在其他页面显示表单字段，用于 editable 插件中，使用示例::

        def some_func(self):
            edit_view = self.get_model_view(ModelFormAdminUtil, self.model, obj)
            form = edit_view.form_obj

    """
    def init_request(self, obj=None):
        self.org_obj = obj
        self.prepare_form()
        self.instance_forms()

    @filter_hook
    def get_form_datas(self):
        return {'instance': self.org_obj}
