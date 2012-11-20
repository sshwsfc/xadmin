# coding=utf-8
from django.db import models

class IDC(models.Model):
    name = models.CharField(u"IDC名称", max_length=64)
    description = models.TextField(u"IDC描述")

    # IDC联系信息
    contact = models.CharField(u"联系人", max_length=32)
    telphone = models.CharField(u"联系电话", max_length=32)
    address = models.CharField(u"地址", max_length=128)
    customer_id = models.CharField(u"客户ID", max_length=128)
    
    create_time = models.DateField(u"签约时间")

    def __unicode__(self):
        return self.name
        
    class Meta:
        verbose_name = u"托管机房"
        verbose_name_plural = verbose_name

SERVER_STATUS = (
    (0, u"正常"),
    (1, u"关机"),
    (2, u"无法链接"),
    (3, u"服务错误"),
)
SERVICE_TYPES = (
    ('moniter', u"监控"),
    ('lvs', u"负载均衡"),
    ('db', u"数据库"),
    ('analysis', u"分析"),
    ('admin', u"管理后台"),
    ('storge', u"存储"),
    ('web', u"WEB"),
    ('email', u"邮件"),
    ('mix', u"综合"),
)
class Host(models.Model):
    """
    服务器主机信息
    """
    idc = models.ForeignKey(IDC, verbose_name=u'托管机房')
    name = models.CharField(u"服务器名称", max_length=64)
    nagios_name = models.CharField(u"Nagios名称", max_length=64, blank=True, null=True)
    ip = models.IPAddressField(u"服务器外部IP", blank=True)
    internal_ip = models.IPAddressField(u"服务器内部IP", blank=True)
    user = models.CharField(u"用户名", max_length=64)
    password = models.CharField(u"密码", max_length=128)
    ssh_port = models.IntegerField(u"SSH端口(默认22)", blank=True, null=True)
    status = models.SmallIntegerField(u"当前状态", choices=SERVER_STATUS)

    # 服务器硬件信息
    brand = models.CharField(u"品牌", max_length=64, choices=[(i,i) for i in (u"DELL", u"惠普", u"其他")])
    model = models.CharField(u"型号", max_length=64)
    cpu = models.CharField(u"CUP", max_length=64)
    core_num = models.SmallIntegerField(u"CUP核数", choices=[(i*2, "%s核" % (i*2)) for i in range(1,15)])
    hard_disk = models.IntegerField(u"硬盘容量(GB)")
    memory = models.IntegerField(u"内存大小(GB)")

    # 服务器软件信息
    system = models.CharField(u"操作系统", max_length=32, choices=[(i,i) for i in (u"CentOS", u"FreeBSD", u"Ubuntu")])
    system_version = models.CharField(u"操作系统版本", max_length=32)
    system_arch = models.CharField(u"操作系统架构", max_length=32, choices=[(i,i) for i in (u"x86_64", u"i386")])

    # 其他服务器信息
    create_time = models.DateField(u"上架时间")
    guarantee_date = models.DateField(u"质保日期")
    service_type = models.CharField(u"服务类型", max_length=32, choices=SERVICE_TYPES)
    description = models.TextField(u"服务器描述")

    def __unicode__(self):
        return self.name
        
    class Meta:
        verbose_name = u"服务器"
        verbose_name_plural = verbose_name

class MaintainLog(models.Model):
    host = models.ForeignKey(Host, verbose_name=u'主机')
    maintain_type = models.CharField(u"维护类型", max_length=32)
    hard_type = models.CharField(u"维护硬件", max_length=16)
    time = models.DateTimeField(u"维护时间")
    operator = models.CharField(u"维修人员", max_length=16)
    note = models.TextField(u"维修记录")

    def __unicode__(self):
        return '%s 维修记录 [%s] %s %s' % (self.host.name, self.time.strftime('%Y-%m-%d %H:%M:%S'), \
            self.maintain_type, self.hard_type)
        
    class Meta:
        verbose_name = u"服务器维护记录"
        verbose_name_plural = verbose_name

class HostGroup(models.Model):
    """
    服务器群组：一组功能相同的服务器应该归为一个服务器群组，例如数据库的主从服务器，web的负载均衡服务器等。
    """
    name = models.CharField(u"名字", max_length=32)
    description = models.TextField(u"服务器描述")
    hosts = models.ManyToManyField(Host, verbose_name=u'服务器', blank=True, related_name='groups')

    class Meta:
        verbose_name = u"服务器群组"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return self.name

class AccessRecord(models.Model):
    date = models.DateField(u"记录日期")
    user_count = models.IntegerField(u"访问人数")
    view_count = models.IntegerField(u"访问次数")

    class Meta:
        verbose_name = u"访问记录"
        verbose_name_plural = verbose_name

    def __unicode__(self):
        return "%s 访问记录" % self.date.strftime('%Y-%m-%d')
