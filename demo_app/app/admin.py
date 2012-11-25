import exadmin
from models import *
from exadmin.layout import *

class IDCAdmin(object):
    list_display = ('name', 'description', 'create_time')
    list_display_links = ('name',)

    search_fields = ['name']
    relfield_style = 'fk-ajax'
    
class HostAdmin(object):
    def open_web(self, instance):
        return "<a href='http://%s' target='_blank'>Open</a>" % instance.ip
    open_web.short_description = "Acts"
    open_web.allow_tags = True
    open_web.is_column = True

    list_display = ('name', 'idc', 'guarantee_date', 'service_type', 'status', 'open_web', 'description')
    list_display_links = ('name',)
    list_editable = ('ip',)

    raw_id_fields = ('idc',)
    style_fields = {'system': "radio-inline"}

    search_fields = ['name', 'ip', 'description']
    list_filter = ['idc', 'guarantee_date', 'status', 'brand', 'model', 'cpu', 'core_num', 'hard_disk', 'memory', 'service_type']

    list_bookmarks = [{'title': "Need Guarantee", 'query': {'status__exact': 2}, 'order': ('-guarantee_date',), 'cols': ('brand', 'guarantee_date', 'service_type')}]

    refresh_times = (3, 5, 10)
    show_detail_fields = ('idc',)
    editable_fields = ('name', 'idc', 'guarantee_date', 'service_type', 'description')

    form_layout = (
        Main(
            Fieldset('Company data',
                'name', 'idc'
            ),
            Fieldset('Contact details',
                'service_type',
                Row('brand', 'model'),
                Row('cpu', 'core_num'),
                Row(AppendedText('hard_disk', 'G'), AppendedText('memory', "G")),
                'guarantee_date'
            ),
        ),
        Side(
            Fieldset('Status data',
                'status', 'ssh_port', 'ip'
            ),
        )
    )
    
class HostGroupAdmin(object):
    list_display = ('name', 'description')
    list_display_links = ('name',)

    search_fields = ['name']
    style_fields = {'hosts': 'checkbox-inline'}

class MaintainLogAdmin(object):
    list_display = ('host', 'maintain_type', 'hard_type', 'time', 'operator', 'note')
    list_display_links = ('host',)

    list_filter = ['host', 'maintain_type', 'hard_type', 'time', 'operator']
    search_fields = ['note']

class AccessRecordAdmin(object):
    def avg_count(self, instance):
        return int(instance.view_count/instance.user_count)
    avg_count.short_description = "Avg Count"
    avg_count.allow_tags = True
    avg_count.is_column = True

    list_display = ('date', 'user_count', 'view_count', 'avg_count')
    list_display_links = ('date',)

    list_filter = ['date', 'user_count', 'view_count']
    actions = None

    data_charts = {
        "user_count": {'title': u"User Report", "x-field": "date", "y-field": ("user_count", "view_count"), "order": ('date',)},
        "avg_count": {'title': u"Avg Report", "x-field": "date", "y-field": ('avg_count',), "order": ('date',)}
    }

exadmin.site.register(Host, HostAdmin)
exadmin.site.register(HostGroup, HostGroupAdmin)
exadmin.site.register(MaintainLog, MaintainLogAdmin)
exadmin.site.register(IDC, IDCAdmin)
exadmin.site.register(AccessRecord, AccessRecordAdmin)
