import json
import django
from django.db import models
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from django.utils.translation import ugettext_lazy as _
from django.core.urlresolvers import reverse
from django.core.serializers.json import DjangoJSONEncoder
from django.db.models.base import ModelBase
from django.utils.encoding import smart_unicode

from django.db.models.signals import post_migrate
from django.contrib.auth.models import Permission

import datetime
import decimal

if 4 < django.VERSION[1] < 7:
    AUTH_USER_MODEL = django.contrib.auth.get_user_model()
else:
    AUTH_USER_MODEL = getattr(settings, 'AUTH_USER_MODEL', 'auth.User')


def add_view_permissions(sender, **kwargs):
    """
    This syncdb hooks takes care of adding a view permission too all our
    content types.
    """
    # for each of our content types
    for content_type in ContentType.objects.all():
        # build our permission slug
        codename = "view_%s" % content_type.model

        # if it doesn't exist..
        if not Permission.objects.filter(content_type=content_type, codename=codename):
            # add it
            Permission.objects.create(content_type=content_type,
                                      codename=codename,
                                      name="Can view %s" % content_type.name)
            #print "Added view permission for %s" % content_type.name

# check for all our view permissions after a syncdb
post_migrate.connect(add_view_permissions)

class Bookmark(models.Model):
    title = models.CharField(_(u'Title'), max_length=128)
    user = models.ForeignKey(AUTH_USER_MODEL, verbose_name=_(u"user"), blank=True, null=True)
    url_name = models.CharField(_(u'Url Name'), max_length=64)
    content_type = models.ForeignKey(ContentType)
    query = models.CharField(_(u'Query String'), max_length=1000, blank=True)
    is_share = models.BooleanField(_(u'Is Shared'), default=False)

    @property
    def url(self):
        base_url = reverse(self.url_name)
        if self.query:
            base_url = base_url + '?' + self.query
        return base_url

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name = _(u'Bookmark')
        verbose_name_plural = _('Bookmarks')


class JSONEncoder(DjangoJSONEncoder):
    def default(self, o):
        if isinstance(o, datetime.date):
            return o.strftime('%Y-%m-%d')
        elif isinstance(o, datetime.datetime):
            return o.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(o, decimal.Decimal):
            return str(o)
        elif isinstance(o, ModelBase):
            return '%s.%s' % (o._meta.app_label, o._meta.model_name)
        else:
            try:
                return super(JSONEncoder, self).default(o)
            except Exception:
                return smart_unicode(o)


class UserSettings(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, verbose_name=_(u"user"))
    key = models.CharField(_('Settings Key'), max_length=256)
    value = models.TextField(_('Settings Content'))

    def json_value(self):
        return json.loads(self.value)

    def set_json(self, obj):
        self.value = json.dumps(obj, cls=JSONEncoder, ensure_ascii=False)

    def __unicode__(self):
        return "%s %s" % (self.user, self.key)

    class Meta:
        verbose_name = _(u'User Setting')
        verbose_name_plural = _('User Settings')


class UserWidget(models.Model):
    user = models.ForeignKey(AUTH_USER_MODEL, verbose_name=_(u"user"))
    page_id = models.CharField(_(u"Page"), max_length=256)
    widget_type = models.CharField(_(u"Widget Type"), max_length=50)
    value = models.TextField(_(u"Widget Params"))

    def get_value(self):
        value = json.loads(self.value)
        value['id'] = self.id
        value['type'] = self.widget_type
        return value

    def set_value(self, obj):
        self.value = json.dumps(obj, cls=JSONEncoder, ensure_ascii=False)

    def save(self, *args, **kwargs):
        created = self.pk is None
        super(UserWidget, self).save(*args, **kwargs)
        if created:
            try:
                portal_pos = UserSettings.objects.get(
                    user=self.user, key="dashboard:%s:pos" % self.page_id)
                portal_pos.value = "%s,%s" % (self.pk, portal_pos.value) if portal_pos.value else self.pk
                portal_pos.save()
            except Exception:
                pass

    def __unicode__(self):
        return "%s %s widget" % (self.user, self.widget_type)

    class Meta:
        verbose_name = _(u'User Widget')
        verbose_name_plural = _('User Widgets')
