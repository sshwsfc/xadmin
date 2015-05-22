# coding:utf-8
__author__ = 'cupen@foxmail.com'
import sys
import django
import django.contrib.auth
import django.conf
# from django.utils import six
from django.utils.encoding import smart_str, force_str
PY2 = sys.version_info[0] == 2
PY3 = sys.version_info[0] == 3

if PY3:
    smart_unicode = smart_str
    force_unicode = force_str

if PY2:
    from django.utils.encoding import smart_unicode, force_unicode

if 4 < django.VERSION[1] < 7:
    AUTH_USER_MODEL = django.contrib.auth.get_user_model()
else:
    AUTH_USER_MODEL = getattr(django.conf.settings, 'AUTH_USER_MODEL', 'auth.User')

def get_auth_user_model():
    return AUTH_USER_MODEL

def filte_dict(_dict, callback):
    """
    >>> from django.conf import settings
    >>> settings.configure()
    >>> d = {"a":1, "b":2, "c":3}
    >>> filte_dict(d, lambda k,v: k != "b")

    :param _dict:
    :param callback:
    :return:
    """
    if not isinstance(_dict, dict):
        raise TypeError("Invalid dict:%s"%(_dict))

    rs = {}
    for k, v in _dict.items():
        if callback(k, v):
            rs[k] = v
    return rs

_buindin_filter = filter
def oh_my_filter(callback, iterable):
    if PY2: return _buindin_filter(callback, iterable)
    return type(iterable)(_buindin_filter(callback, iterable))

filter = oh_my_filter