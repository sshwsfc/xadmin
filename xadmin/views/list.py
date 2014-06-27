# coding=utf-8
from django.core.exceptions import PermissionDenied, ObjectDoesNotExist
from django.core.paginator import InvalidPage, Paginator
from django.db import models
from django.http import HttpResponseRedirect
from django.template.response import SimpleTemplateResponse, TemplateResponse
from django.utils.datastructures import SortedDict
from django.utils.encoding import force_unicode, smart_unicode
from django.utils.html import escape, conditional_escape
from django.utils.safestring import mark_safe
from django.utils.text import capfirst
from django.utils.translation import ugettext as _

from xadmin.util import lookup_field, display_for_field, label_for_field, boolean_icon

from base import ModelAdminView, filter_hook, inclusion_tag, csrf_protect_m

# 列表页面的一些特殊参数, 从 django admin 中继承来
ALL_VAR = 'all'
ORDER_VAR = 'o'
PAGE_VAR = 'p'
TO_FIELD_VAR = 't'
COL_LIST_VAR = '_cols'
ERROR_FLAG = 'e'

DOT = '.'

# 数据表格中的值为空时显示的值
EMPTY_CHANGELIST_VALUE = _('Null')


class FakeMethodField(object):
    """
    This class used when a column is an model function, wrap function as a fake field to display in select columns.
    """
    def __init__(self, name, verbose_name):
        # Initial comm field attrs
        self.name = name
        self.verbose_name = verbose_name
        self.primary_key = False


class ResultRow(dict):
    pass


class ResultItem(object):

    def __init__(self, field_name, row):
        self.classes = []
        self.text = '&nbsp;'
        self.wraps = []
        self.tag = 'td'
        self.tag_attrs = []
        self.allow_tags = False
        self.btns = []
        self.menus = []
        self.is_display_link = False
        self.row = row
        self.field_name = field_name
        self.field = None
        self.attr = None
        self.value = None

    @property
    def label(self):
        text = mark_safe(
            self.text) if self.allow_tags else conditional_escape(self.text)
        if force_unicode(text) == '':
            text = mark_safe('&nbsp;')
        for wrap in self.wraps:
            text = mark_safe(wrap % text)
        return text

    @property
    def tagattrs(self):
        return mark_safe(
            '%s%s' % ((self.tag_attrs and ' '.join(self.tag_attrs) or ''),
            (self.classes and (' class="%s"' % ' '.join(self.classes)) or '')))


class ResultHeader(ResultItem):

    def __init__(self, field_name, row):
        super(ResultHeader, self).__init__(field_name, row)
        self.tag = 'th'
        self.tag_attrs = ['scope="col"']
        self.sortable = False
        self.allow_tags = True
        self.sorted = False
        self.ascending = None
        self.sort_priority = None
        self.url_primary = None
        self.url_remove = None
        self.url_toggle = None


class ListAdminView(ModelAdminView):
    """
    显示数据列表的 AdminView, 该 View 实现了基本的数据排序和分页等功能.

    **Option 属性**

        .. autoattribute:: list_display
        .. autoattribute:: list_display_links
        .. autoattribute:: list_select_related
        .. autoattribute:: list_per_page
        .. autoattribute:: list_max_show_all

        .. autoattribute:: list_exclude
        .. autoattribute:: search_fields

        .. autoattribute:: ordering
        .. autoattribute:: object_list_template

    """
    list_display = ('__str__',)    #: 默认显示列
    list_display_links = ()        #: 显示修改或查看数据详情连接的列
    list_display_links_details = False  #: 点击列表连接后是否转到详情页面
    list_select_related = None     #: 是否提前加载关联数据, 使用 ``select_related``
    list_per_page = 50             #: 每页显示数据的条数
    list_max_show_all = 200        #: 每页最大显示数据的条数
    list_exclude = ()              #: 排除显示的列, 在显示列的设置中不会出现这些被排除的列
    search_fields = ()             #: 按照这些列搜索数据
    paginator_class = Paginator    #: 分页类
    ordering = None                #: 默认的数据排序

    object_list_template = None    #: 显示数据的模板

    def init_request(self, *args, **kwargs):
        """
        初始化请求, 首先判断当前用户有无 view 权限, 而后进行一些生成数据列表所需的变量的初始化操作.
        """
        if not self.has_view_permission():
            raise PermissionDenied

        request = self.request
        request.session['LIST_QUERY'] = (self.model_info, self.request.META['QUERY_STRING'])

        self.pk_attname = self.opts.pk.attname
        self.lookup_opts = self.opts
        self.list_display = self.get_list_display()
        self.list_display_links = self.get_list_display_links()

        # 获取当前页码
        try:
            self.page_num = int(request.GET.get(PAGE_VAR, 0))
        except ValueError:
            self.page_num = 0

        # 获取各种参数
        self.show_all = ALL_VAR in request.GET
        self.to_field = request.GET.get(TO_FIELD_VAR)
        self.params = dict(request.GET.items())

        # 删除已经获取的参数, 因为后面可能要用 params 或过滤数据
        if PAGE_VAR in self.params:
            del self.params[PAGE_VAR]
        if ERROR_FLAG in self.params:
            del self.params[ERROR_FLAG]

    @filter_hook
    def get_list_display(self):
        """
        获得列表显示的列. 如果 request 中有 ``_cols`` 参数, 则使用该参数, 否则使用 :attr:`list_display`.

        .. note::

            该方法会赋值 :attr:`base_list_display` 属性, 保存 list_display. 如果有插件修改了该方法的返回值
            (例如: Action 插件), 可能会增加其他列. 但是这些列可能对其他插件没有意义(例如: 导出数据插件). 那么其他插件可以使用
            :attr:`base_list_display` 这个属性, 取得最原始的显示列.
        """
        self.base_list_display = (COL_LIST_VAR in self.request.GET and self.request.GET[COL_LIST_VAR] != "" and \
            self.request.GET[COL_LIST_VAR].split('.')) or self.list_display
        return list(self.base_list_display)

    @filter_hook
    def get_list_display_links(self):
        """
        返回一组列, 这些列的数据会以链接形式显示, 连接地址可能是数据修改页面(如果有修改权限), 或是查看页面. 
        默认情况下会使用 :attr:`list_display_links` , 如果 :attr:`list_display_links` 为空, 则返回 :attr:`list_display` 第一列.
        """
        # 没有使用 :meth:`get_list_display` 返回的值, 因为 :meth:`get_list_display` 返回的值可能会被插件修改
        if self.list_display_links or not self.list_display:
            return self.list_display_links
        else:
            return list(self.list_display)[:1]

    def make_result_list(self):
        """
        该方法负责生成数据列表及分页信息. 数据列表会赋值给属性 :attr:`result_list` , 插件可以在该方法后执行一些数据处理.
        """
        # 基本 queryset
        self.base_queryset = self.queryset()
        # 排序及过滤等处理后的 queryset
        self.list_queryset = self.get_list_queryset()
        self.ordering_field_columns = self.get_ordering_field_columns()
        self.paginator = self.get_paginator()

        # 获取当前据数目
        self.result_count = self.paginator.count

        if not self.list_queryset.query.where:
            # 如果没有任何过滤条件, result_count 就是 全不数据条目
            self.full_result_count = self.result_count
        else:
            self.full_result_count = self.base_queryset.count()

        self.can_show_all = self.result_count <= self.list_max_show_all
        self.multi_page = self.result_count > self.list_per_page

        if (self.show_all and self.can_show_all) or not self.multi_page:
            self.result_list = self.list_queryset._clone()
        else:
            try:
                self.result_list = self.paginator.page(
                    self.page_num + 1).object_list
            except InvalidPage:
                # 分页错误, 这里的错误页面需要调整一下
                if ERROR_FLAG in self.request.GET.keys():
                    return SimpleTemplateResponse('xadmin/views/invalid_setup.html', {
                        'title': _('Database error'),
                    })
                return HttpResponseRedirect(self.request.path + '?' + ERROR_FLAG + '=1')
        self.has_more = self.result_count > (
            self.list_per_page * self.page_num + len(self.result_list))

    @filter_hook
    def get_result_list(self):
        return self.make_result_list()

    @filter_hook
    def post_result_list(self):
        return self.make_result_list()

    @filter_hook
    def get_list_queryset(self):
        """
        取得 Model 的 queryset, 该 queryset 已经进行排序和过滤过. 其他插件可以在这里修改 queryset
        """
        # 首先取得基本的 queryset
        queryset = self.queryset()

        if not queryset.query.select_related:
            if self.list_select_related:
                queryset = queryset.select_related()
            elif self.list_select_related is None:
                related_fields = []
                for field_name in self.list_display:
                    try:
                        field = self.opts.get_field(field_name)
                    except models.FieldDoesNotExist:
                        pass
                    else:
                        if isinstance(field.rel, models.ManyToOneRel):
                            related_fields.append(field_name)
                if related_fields:
                    # 有关联字段显示, 则使用 ``select_related``
                    queryset = queryset.select_related(*related_fields)
            else:
                pass

        # 进行排序
        queryset = queryset.order_by(*self.get_ordering())
        
        return queryset

    # List ordering
    def _get_default_ordering(self):
        ordering = []
        if self.ordering:
            ordering = self.ordering
        elif self.opts.ordering:
            ordering = self.opts.ordering
        return ordering

    @filter_hook
    def get_ordering_field(self, field_name):
        """
        根据参数 ``field_name`` 获取需要排序 Field 的名字. ``field_name`` 可能是 Model 的一个标准 DB Field, 
        也有可能是可执行方法, 或是 OptionClass 及 Model 的一个属性, 这种情况下会取其 ``admin_order_field`` 属性
        作为排序字段, 如果取不到, 则返回 ``None``. 例如::

            class UserAdmin(object):
                def my_field(self, obj):
                    return obj.name.lower()
                my_field.admin_order_field = 'name'

        """
        try:
            field = self.opts.get_field(field_name)
            return field.name
        except models.FieldDoesNotExist:
            # 在非 db field 中获取
            if callable(field_name):
                attr = field_name
            elif hasattr(self, field_name):
                attr = getattr(self, field_name)
            else:
                attr = getattr(self.model, field_name)
            return getattr(attr, 'admin_order_field', None)

    @filter_hook
    def get_ordering(self):
        """
        Returns the list of ordering fields for the change list.
        First we check the get_ordering() method in model admin, then we check
        the object's default ordering. Then, any manually-specified ordering
        from the query string overrides anything. Finally, a deterministic
        order is guaranteed by ensuring the primary key is used as the last
        ordering field.
        """
        ordering = list(super(ListAdminView, self).get_ordering()
                        or self._get_default_ordering())
        if ORDER_VAR in self.params and self.params[ORDER_VAR]:
            # Clear ordering and used params
            ordering = [pfx + self.get_ordering_field(field_name) for n, pfx, field_name in
                        map(
                        lambda p: p.rpartition('-'),
                        self.params[ORDER_VAR].split('.'))
                        if self.get_ordering_field(field_name)]

        # Ensure that the primary key is systematically present in the list of
        # ordering fields so we can guarantee a deterministic order across all
        # database backends.
        pk_name = self.opts.pk.name
        if not (set(ordering) & set(['pk', '-pk', pk_name, '-' + pk_name])):
            # The two sets do not intersect, meaning the pk isn't present. So
            # we add it.
            ordering.append('-pk')

        return ordering

    @filter_hook
    def get_ordering_field_columns(self):
        """
        Returns a SortedDict of ordering field column numbers and asc/desc
        """

        # We must cope with more than one column having the same underlying sort
        # field, so we base things on column numbers.
        ordering = self._get_default_ordering()
        ordering_fields = SortedDict()
        if ORDER_VAR not in self.params or not self.params[ORDER_VAR]:
            # for ordering specified on ModelAdmin or model Meta, we don't know
            # the right column numbers absolutely, because there might be more
            # than one column associated with that ordering, so we guess.
            for field in ordering:
                if field.startswith('-'):
                    field = field[1:]
                    order_type = 'desc'
                else:
                    order_type = 'asc'
                for attr in self.list_display:
                    if self.get_ordering_field(attr) == field:
                        ordering_fields[field] = order_type
                        break
        else:
            for p in self.params[ORDER_VAR].split('.'):
                none, pfx, field_name = p.rpartition('-')
                ordering_fields[field_name] = 'desc' if pfx == '-' else 'asc'
        return ordering_fields

    def get_check_field_url(self, f):
        """
        返回 ``显示列`` 菜单项中每一项的 url. 
        """
        # 使用 :attr:`base_list_display` 作为基础列, 因为 :attr:`list_display` 可能已经被插件修改
        fields = [fd for fd in self.base_list_display if fd != f.name]
        if len(self.base_list_display) == len(fields):
            if f.primary_key:
                fields.insert(0, f.name)
            else:
                fields.append(f.name)
        return self.get_query_string({COL_LIST_VAR: '.'.join(fields)})

    def get_model_method_fields(self):
        """
        将所有 OptionClass 中含有 ``is_column=True`` 的方法, 使用 :class:`FakeMethodField` 包装成一个假
        的 DB Field. 用于在选择显示列的功能中显示.
        """
        methods = []
        for name in dir(self):
            try:
                if getattr(getattr(self, name), 'is_column', False):
                    methods.append((name, getattr(self, name)))
            except:
                pass
        return [FakeMethodField(name, getattr(method, 'short_description', capfirst(name.replace('_', ' '))))
                for name, method in methods]

    @filter_hook
    def get_context(self):
        """
        **Context Params** :

            ``model_fields`` : 用于 ``选择显示列`` 功能, 保存所有可显示的列信息

            ``result_headers`` : 显示列表的头部信息, 是 :class:`ResultHeader` 列表

            ``results`` : 显示列表的内容信息, 是 :class:`ResultItem` 列表
        """
        self.title = _('%s List') % force_unicode(self.opts.verbose_name)

        # 获取所有可供显示的列的信息
        model_fields = [(f, f.name in self.list_display, self.get_check_field_url(f))
                        for f in (self.opts.fields + self.get_model_method_fields()) if f.name not in self.list_exclude]

        new_context = {
            'module_name': force_unicode(self.opts.verbose_name_plural),
            'title': self.title,
            'cl': self,
            'model_fields': model_fields,
            'clean_select_field_url': self.get_query_string(remove=[COL_LIST_VAR]),
            'has_add_permission': self.has_add_permission(),
            'app_label': self.app_label,
            'brand_name': self.opts.verbose_name_plural,
            'brand_icon': self.get_model_icon(self.model),
            'add_url': self.model_admin_url('add'),
            'result_headers': self.result_headers(),
            'results': self.results()
        }
        context = super(ListAdminView, self).get_context()
        context.update(new_context)
        return context

    @filter_hook
    def get_response(self, context, *args, **kwargs):
        """
        在 :meth:`get_context` 之后执行. 该方法默认无返回内容, 插件可以复写该方法, 返回指定的 HttpResponse.
        """
        pass

    @csrf_protect_m
    @filter_hook
    def get(self, request, *args, **kwargs):
        """
        显示 Model 列表. 
        """
        # 首选获取列表 result_list
        response = self.get_result_list()
        if response:
            return response

        context = self.get_context()
        context.update(kwargs or {})

        response = self.get_response(context, *args, **kwargs)

        return response or TemplateResponse(request, self.object_list_template or
                                            self.get_template_list('views/model_list.html'), context, current_app=self.admin_site.name)

    @filter_hook
    def post_response(self, *args, **kwargs):
        """
        列表的 POST 请求, 该方法默认无返回内容, 插件可以复写该方法, 返回指定的 HttpResponse.
        """
        pass

    @csrf_protect_m
    @filter_hook
    def post(self, request, *args, **kwargs):
        """
        显示 Model 列表的 POST 请求, 默认跟 GET 请求返回同样的结果, 插件可以通过复写 :meth:`post_response` 方法改变 POST 请求的返回
        """
        return self.post_result_list() or self.post_response(*args, **kwargs) or self.get(request, *args, **kwargs)

    @filter_hook
    def get_paginator(self):
        """
        返回 paginator 实例, 使用 :attr:`paginator_class` 类实例化
        """
        return self.paginator_class(self.list_queryset, self.list_per_page, 0, True)

    @filter_hook
    def get_page_number(self, i):
        """
        返回翻页组件各页码显示的 HTML 内容. 默认使用 bootstrap 样式

        :param i: 页码, 可能是 ``DOT``
        """
        if i == DOT:
            return mark_safe(u'<span class="dot-page">...</span> ')
        elif i == self.page_num:
            return mark_safe(u'<span class="this-page">%d</span> ' % (i + 1))
        else:
            return mark_safe(u'<a href="%s"%s>%d</a> ' % (escape(self.get_query_string({PAGE_VAR: i})), (i == self.paginator.num_pages - 1 and ' class="end"' or ''), i + 1))

    @filter_hook
    def result_header(self, field_name, row):
        """
        返回某一列的头信息, 一个 :class:`ResultHeader` 实例.

        :param field_name: 列的名字
        :param row: :class:`ResultHeader` 实例
        """
        ordering_field_columns = self.ordering_field_columns
        item = ResultHeader(field_name, row)
        text, attr = label_for_field(field_name, self.model,
                                     model_admin=self,
                                     return_attr=True
                                     )
        item.text = text
        item.attr = attr
        if attr and not getattr(attr, "admin_order_field", None):
            return item

        # 接下来就是处理列排序的问题了
        th_classes = ['sortable']
        order_type = ''
        new_order_type = 'desc'
        sort_priority = 0
        sorted = False
        # 判断当前列是否已经排序
        if field_name in ordering_field_columns:
            sorted = True
            order_type = ordering_field_columns.get(field_name).lower()
            sort_priority = ordering_field_columns.keys().index(field_name) + 1
            th_classes.append('sorted %sending' % order_type)
            new_order_type = {'asc': 'desc', 'desc': 'asc'}[order_type]

        # build new ordering param
        o_list_asc = []  # URL for making this field the primary sort
        o_list_desc = []  # URL for making this field the primary sort
        o_list_remove = []  # URL for removing this field from sort
        o_list_toggle = []  # URL for toggling order type for this field
        make_qs_param = lambda t, n: ('-' if t == 'desc' else '') + str(n)

        for j, ot in ordering_field_columns.items():
            if j == field_name:  # Same column
                param = make_qs_param(new_order_type, j)
                # We want clicking on this header to bring the ordering to the
                # front
                o_list_asc.insert(0, j)
                o_list_desc.insert(0, '-' + j)
                o_list_toggle.append(param)
                # o_list_remove - omit
            else:
                param = make_qs_param(ot, j)
                o_list_asc.append(param)
                o_list_desc.append(param)
                o_list_toggle.append(param)
                o_list_remove.append(param)

        if field_name not in ordering_field_columns:
            o_list_asc.insert(0, field_name)
            o_list_desc.insert(0, '-' + field_name)

        item.sorted = sorted
        item.sortable = True
        item.ascending = (order_type == "asc")
        item.sort_priority = sort_priority

        # 列排序菜单的内容
        menus = [
            ('asc', o_list_asc, 'caret-up', _(u'Sort ASC')),
            ('desc', o_list_desc, 'caret-down', _(u'Sort DESC')),
        ]
        if sorted:
            row['num_sorted_fields'] = row['num_sorted_fields'] + 1
            menus.append((None, o_list_remove, 'times', _(u'Cancel Sort')))
            item.btns.append('<a class="toggle" href="%s"><i class="fa fa-%s"></i></a>' % (
                self.get_query_string({ORDER_VAR: '.'.join(o_list_toggle)}), 'sort-up' if order_type == "asc" else 'sort-down'))

        item.menus.extend(['<li%s><a href="%s" class="active"><i class="fa fa-%s"></i> %s</a></li>' %
                         (
                             (' class="active"' if sorted and order_type == i[
                              0] else ''),
                           self.get_query_string({ORDER_VAR: '.'.join(i[1])}), i[2], i[3]) for i in menus])
        item.classes.extend(th_classes)

        return item

    @filter_hook
    def result_headers(self):
        """
        返回列表的列头信息. 返回一个 :class:`ResultRow` 实例, 其 ``cells`` 属性包含列信息
        """
        row = ResultRow()
        row['num_sorted_fields'] = 0
        row.cells = [self.result_header(
            field_name, row) for field_name in self.list_display]
        return row

    @filter_hook
    def result_item(self, obj, field_name, row):
        """
        返回某一对象某一列的数据, :class:`ResultItem` 实例.

        :param obj: Model 对象
        :param field_name: 列的名字
        :param row: :class:`ResultHeader` 实例
        """
        item = ResultItem(field_name, row) # 首先初始化
        try:
            f, attr, value = lookup_field(field_name, obj, self)
        except (AttributeError, ObjectDoesNotExist):
            item.text = mark_safe("<span class='text-muted'>%s</span>" % EMPTY_CHANGELIST_VALUE)
        else:
            if f is None:
                # Model 属性或是 OptionClass 属性列
                item.allow_tags = getattr(attr, 'allow_tags', False)
                boolean = getattr(attr, 'boolean', False)
                if boolean:
                    item.allow_tags = True
                    item.text = boolean_icon(value)
                else:
                    item.text = smart_unicode(value)
            else:
                # 处理关联咧
                if isinstance(f.rel, models.ManyToOneRel):
                    field_val = getattr(obj, f.name)
                    if field_val is None:
                        item.text = mark_safe("<span class='text-muted'>%s</span>" % EMPTY_CHANGELIST_VALUE)
                    else:
                        item.text = field_val
                else:
                    item.text = display_for_field(value, f)
                if isinstance(f, models.DateField)\
                    or isinstance(f, models.TimeField)\
                        or isinstance(f, models.ForeignKey):
                    item.classes.append('nowrap')

            item.field = f
            item.attr = attr
            item.value = value

        # 如果没有指定 ``list_display_links`` , 使用第一列作为内容连接列.
        if (item.row['is_display_first'] and not self.list_display_links) \
                or field_name in self.list_display_links:
            item.row['is_display_first'] = False
            item.is_display_link = True
            if self.list_display_links_details:
                item_res_uri = self.model_admin_url("detail", getattr(obj, self.pk_attname))
                if item_res_uri:
                    edit_url = self.model_admin_url("change", getattr(obj, self.pk_attname))
                    item.wraps.append('<a data-res-uri="%s" data-edit-uri="%s" class="details-handler" rel="tooltip" title="%s">%%s</a>'
                                     % (item_res_uri, edit_url, _(u'Details of %s') % str(obj)))
            else:
                url = self.url_for_result(obj)
                item.wraps.append(u'<a href="%s">%%s</a>' % url)

        return item

    @filter_hook
    def result_row(self, obj):
        """
        返回列表某一行的内容信息. 返回一个 :class:`ResultRow` 实例, 其 ``cells`` 属性包含各列内容信息

        :param obj: Model 对象
        """
        row = ResultRow()
        row['is_display_first'] = True
        row['object'] = obj
        row.cells = [self.result_item(
            obj, field_name, row) for field_name in self.list_display]
        return row

    @filter_hook
    def results(self):
        """
        返回整个列表内容信息. 返回一个 :class:`ResultRow` 的数据, 包含各行信息
        """
        results = []
        for obj in self.result_list:
            results.append(self.result_row(obj))
        return results

    @filter_hook
    def url_for_result(self, result):
        """
        返回列表内容连接. 如果当前用户有修改权限就返回修改页面的连接, 否则返回查看详情页面连接
        
        :param result: Model 对象
        """
        return self.get_object_url(result)

    # Media
    @filter_hook
    def get_media(self):
        """
        返回列表页面的 Media, 该页面添加了 ``xadmin.page.list.js`` 文件
        """
        media = super(ListAdminView, self).get_media() + self.vendor('xadmin.page.list.js', 'xadmin.page.form.js')
        if self.list_display_links_details:
            media += self.vendor('xadmin.plugin.details.js', 'xadmin.form.css')
        return media

    # Blocks
    @inclusion_tag('xadmin/includes/pagination.html')
    def block_pagination(self, context, nodes, page_type='normal'):
        paginator, page_num = self.paginator, self.page_num

        pagination_required = (
            not self.show_all or not self.can_show_all) and self.multi_page
        if not pagination_required:
            page_range = []
        else:
            ON_EACH_SIDE = {'normal': 5, 'small': 3}.get(page_type, 3)
            ON_ENDS = 2

            # If there are 10 or fewer pages, display links to every page.
            # Otherwise, do some fancy
            if paginator.num_pages <= 10:
                page_range = range(paginator.num_pages)
            else:
                # Insert "smart" pagination links, so that there are always ON_ENDS
                # links at either end of the list of pages, and there are always
                # ON_EACH_SIDE links at either end of the "current page" link.
                page_range = []
                if page_num > (ON_EACH_SIDE + ON_ENDS):
                    page_range.extend(range(0, ON_EACH_SIDE - 1))
                    page_range.append(DOT)
                    page_range.extend(
                        range(page_num - ON_EACH_SIDE, page_num + 1))
                else:
                    page_range.extend(range(0, page_num + 1))
                if page_num < (paginator.num_pages - ON_EACH_SIDE - ON_ENDS - 1):
                    page_range.extend(
                        range(page_num + 1, page_num + ON_EACH_SIDE + 1))
                    page_range.append(DOT)
                    page_range.extend(range(
                        paginator.num_pages - ON_ENDS, paginator.num_pages))
                else:
                    page_range.extend(range(page_num + 1, paginator.num_pages))

        need_show_all_link = self.can_show_all and not self.show_all and self.multi_page
        return {
            'cl': self,
            'pagination_required': pagination_required,
            'show_all_url': need_show_all_link and self.get_query_string({ALL_VAR: ''}),
            'page_range': map(self.get_page_number, page_range),
            'ALL_VAR': ALL_VAR,
            '1': 1,
        }
