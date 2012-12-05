from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.utils import simplejson
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.base import ModelBase
from django.utils.encoding import smart_unicode

import datetime, decimal

class Bookmark(models.Model):
    title = models.CharField(_(u'Title'), max_length=128)
    user = models.ForeignKey(User, blank=True, null=True)
    url_name = models.CharField(_(u'Url Name'), max_length=64)
    content_type = models.ForeignKey(ContentType)
    query = models.CharField(_(u'Query String'), max_length=1000, blank=True)
    is_share = models.BooleanField(_(u'Is Share'), default=False)

    @property
    def url(self):
        base_url = reverse(self.url_name)
        if self.query:
            base_url = base_url + '?' + self.query
        return base_url

    def __unicode__(self):
        return self.title
        
    class Meta:
        verbose_name = _('Bookmark')

class JSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.date):
            return o.strftime('%Y-%m-%d')
        elif isinstance(o, datetime.datetime):
            return o.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(o, decimal.Decimal):
            return str(o)
        elif isinstance(o, ModelBase):
            return '%s.%s' % (o._meta.app_label, o._meta.module_name)
        else:
            try:
                return super(JSONEncoder, self).default(o)
            except Exception:
                return smart_unicode(o)

class UserSettings(models.Model):
    user = models.ForeignKey(User)
    key = models.CharField(max_length=256)
    value = models.TextField()

    def json_value(self):
        return simplejson.loads(self.value)

    def set_json(self, obj):
        self.value = simplejson.dumps(obj, cls=JSONEncoder, ensure_ascii=False)

    def __unicode__(self):
        return "%s %s" % (self.user, self.key)
        
    class Meta:
        verbose_name = _('User Setting')

class UserWidget(models.Model):
    user = models.ForeignKey(User)
    page_id = models.CharField(_(u"Page"), max_length=256)
    widget_type = models.CharField(_(u"Widget Type"), max_length=16)
    value = models.TextField()

    def get_value(self):
        value = simplejson.loads(self.value)
        value['id'] = self.id
        value['type'] = self.widget_type
        return value

    def set_value(self, obj):
        self.value = simplejson.dumps(obj, cls=JSONEncoder, ensure_ascii=False)

    def __unicode__(self):
        return "%s %s widget" % (self.user, self.widget_type)
        
    class Meta:
        verbose_name = _('User Widget')
