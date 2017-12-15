from __future__ import absolute_import
import xadmin
from xadmin import views
from .models import IDC, Host, MaintainLog, HostGroup, AccessRecord
from xadmin.layout import Main, TabHolder, Tab, Fieldset, Row, Col, AppendedText, Side
from xadmin.plugins.inline import Inline
from xadmin.plugins.batch import BatchChangeAction


@xadmin.sites.register(views.website.IndexView)
class MainDashboard(object):
    widgets = [
        [
            {"type": "html", "title": "Test Widget",
             "content": "<h3> Welcome to Xadmin! </h3><p>Join Online Group: <br/>QQ Qun : 282936295</p>"},
            {"type": "chart", "model": "app.accessrecord", "chart": "user_count",
             "params": {"_p_date__gte": "2013-01-08", "p": 1, "_p_date__lt": "2013-01-29"}},
            {"type": "list", "model": "app.host", "params": {"o": "-guarantee_date"}},
        ],
        [
            {"type": "qbutton", "title": "Quick Start",
             "btns": [{"model": Host}, {"model": IDC}, {"title": "Google", "url": "http://www.google.com"}]},
            {"type": "addform", "model": MaintainLog},
        ]
    ]


@xadmin.sites.register(views.BaseAdminView)
class BaseSetting(object):
    enable_themes = True
    use_bootswatch = True


@xadmin.sites.register(views.CommAdminView)
class GlobalSetting(object):
    global_search_models = [Host, IDC]
    global_models_icon = {
        Host: "fa fa-laptop", IDC: "fa fa-cloud"
    }
    menu_style = 'default'  # 'accordion'


class MaintainInline(object):
    model = MaintainLog
    extra = 1
    style = "accordion"


@xadmin.sites.register(IDC)
class IDCAdmin(object):
    list_display = ("name", "description", "create_time", "contact", "telphone", "address", "customer_id")
    list_display_links = ("name",)
    wizard_form_list = [
        ("First's Form", ("name", "description")),
        ("Second Form", ("contact", "telphone", "address")),
        ("Thread Form", ("customer_id",))
    ]
    search_fields = ["name", "description", "contact", "telphone", "address"]
    list_filter = [
        "name"
    ]
    list_quick_filter = [{"field": "name", "limit": 10}]

    search_fields = ["name"]
    relfield_style = "fk-select"
    reversion_enable = True

    actions = [BatchChangeAction, ]
    batch_fields = ("contact", "description", "address", "customer_id")


@xadmin.sites.register(Host)
class HostAdmin(object):

    def open_web(self, instance):
        return """<a href="http://%s" target="_blank">Open</a>""" % instance.ip

    open_web.short_description = "Acts"
    open_web.allow_tags = True
    open_web.is_column = True

    list_display = (
        "name", "idc", "guarantee_date", "service_type", "status", "open_web",
        "description", "ip",
    )
    list_display_links = ("name",)

    raw_id_fields = ("idc",)
    style_fields = {"system": "radio-inline"}

    search_fields = ["name", "ip", "description", "idc__name"]
    list_filter = [
        "idc", "guarantee_date", "status", "brand", "model", "cpu", "core_num",
        "hard_disk", "memory", (
            "service_type",
            xadmin.filters.MultiSelectFieldListFilter,
        ),
    ]

    list_quick_filter = ["service_type", {"field": "idc__name", "limit": 10}]
    # list_quick_filter = ["idc_id"]
    list_bookmarks = [{
        "title": "Need Guarantee",
        "query": {"status__exact": 2},
        "order": ("-guarantee_date",),
        "cols": ("brand", "guarantee_date", "service_type"),
    }]

    show_detail_fields = ("idc",)
    list_editable = (
        "name", "idc", "guarantee_date", "service_type", "description", "ip"
    )
    save_as = True

    aggregate_fields = {"guarantee_date": "min"}
    grid_layouts = ("table", "thumbnails")

    form_layout = (
        Main(
            TabHolder(
                Tab(
                    "Comm Fields",
                    Fieldset(
                        "Company data", "name", "idc",
                        description="some comm fields, required",
                    ),
                    Inline(MaintainLog),
                ),
                Tab(
                    "Extend Fields",
                    Fieldset(
                        "Contact details",
                        "service_type",
                        Row("brand", "model"),
                        Row("cpu", "core_num"),
                        Row(
                            AppendedText("hard_disk", "G"),
                            AppendedText("memory", "G")
                        ),
                        "guarantee_date"
                    ),
                ),
            ),
        ),
        Side(
            Fieldset("Status data", "status", "ssh_port", "ip"),
        )
    )
    inlines = [MaintainInline]
    reversion_enable = True

    data_charts = {
        "host_service_type_counts": {'title': u"Host service type count", "x-field": "service_type",
                                     "y-field": ("service_type",),
                                     "option": {
                                         "series": {"bars": {"align": "center", "barWidth": 0.8, 'show': True}},
                                         "xaxis": {"aggregate": "count", "mode": "categories"},
                                     },
                                     },
    }


@xadmin.sites.register(HostGroup)
class HostGroupAdmin(object):
    list_display = ("name", "description")
    list_display_links = ("name",)

    list_filter = ["hosts"]
    search_fields = ["name"]
    style_fields = {"hosts": "checkbox-inline"}


@xadmin.sites.register(MaintainLog)
class MaintainLogAdmin(object):
    list_display = (
        "host", "maintain_type", "hard_type", "time", "operator", "note")
    list_display_links = ("host",)

    list_filter = ["host", "maintain_type", "hard_type", "time", "operator"]
    search_fields = ["note"]

    form_layout = (
        Col("col2",
            Fieldset("Record data",
                     "time", "note",
                     css_class="unsort short_label no_title"
                     ),
            span=9, horizontal=True
            ),
        Col("col1",
            Fieldset("Comm data",
                     "host", "maintain_type"
                     ),
            Fieldset("Maintain details",
                     "hard_type", "operator"
                     ),
            span=3
            )
    )
    reversion_enable = True


@xadmin.sites.register(AccessRecord)
class AccessRecordAdmin(object):

    def avg_count(self, instance):
        return int(instance.view_count / instance.user_count)

    avg_count.short_description = "Avg Count"
    avg_count.allow_tags = True
    avg_count.is_column = True

    list_display = ("date", "user_count", "view_count", "avg_count")
    list_display_links = ("date",)

    list_filter = ["date", "user_count", "view_count"]
    actions = None
    aggregate_fields = {"user_count": "sum", "view_count": "sum"}

    refresh_times = (3, 5, 10)
    data_charts = {
        "user_count": {'title': u"User Report", "x-field": "date", "y-field": ("user_count", "view_count"),
                       "order": ('date',)},
        "avg_count": {'title': u"Avg Report", "x-field": "date", "y-field": ('avg_count',), "order": ('date',)},
        "per_month": {'title': u"Monthly Users", "x-field": "_chart_month", "y-field": ("user_count",),
                      "option": {
                          "series": {"bars": {"align": "center", "barWidth": 0.8, 'show': True}},
                          "xaxis": {"aggregate": "sum", "mode": "categories"},
        },
        },
    }

    def _chart_month(self, obj):
        return obj.date.strftime("%B")

# xadmin.sites.site.register(HostGroup, HostGroupAdmin)
# xadmin.sites.site.register(MaintainLog, MaintainLogAdmin)
# xadmin.sites.site.register(IDC, IDCAdmin)
# xadmin.sites.site.register(AccessRecord, AccessRecordAdmin)
