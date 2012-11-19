# coding=UTF-8
import exadmin
from models import *

class IDCAdmin(object):
    list_display = ('name', 'description', 'create_time')
    list_display_links = ('name',)

    search_fields = ['name']
    
class HostAdmin(object):
    def open_terminal(self, instance):
        return "<a href='/run?host_id=%s&method=shell' target='_blank'>终端</a>" % instance.id;
    open_terminal.short_description = "终端"
    open_terminal.allow_tags = True
    open_terminal.is_column = True

    list_display = ('name', 'idc', 'guarantee_date', 'service_type', 'status', 'open_terminal', 'description')
    list_display_links = ('name',)
    list_editable = ('ip',)

    search_fields = ['name', 'ip', 'description']
    list_filter = ['idc', 'guarantee_date', 'status', 'brand', 'model', 'cpu', 'core_num', 'hard_disk', 'memory', 'service_type']

    list_bookmarks = [{'title': "快要到质保期的无法连接的服务器", 'query': {'status__exact': 2}, 'order': ('-guarantee_date',), 'cols': ('brand', 'guarantee_date', 'service_type')}]

    refresh_times = (3, 5, 10)
    show_detail_fields = ('idc',)
    editable_fields = ('name', 'idc', 'guarantee_date', 'service_type', 'description')
    
class HostGroupAdmin(object):
    list_display = ('name', 'description')
    list_display_links = ('name',)

    search_fields = ['name']


class MaintainLogAdmin(object):
    list_display = ('host', 'maintain_type', 'hard_type', 'time', 'operator', 'note')
    list_display_links = ('host',)

    list_filter = ['host', 'maintain_type', 'hard_type', 'time', 'operator']
    search_fields = ['note']

exadmin.site.register(Host, HostAdmin)
exadmin.site.register(HostGroup, HostGroupAdmin)
exadmin.site.register(MaintainLog, MaintainLogAdmin)
exadmin.site.register(IDC, IDCAdmin)
