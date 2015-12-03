# coding:utf-8
__author__ = 'cupen@foxmail.com'
import sys
from django.utils import six
from django.utils.encoding import smart_str, force_str

PY2 = sys.version_info[0] == 2
PY3 = sys.version_info[0] == 3

if PY3:
    smart_unicode = smart_str
    force_unicode = force_str

if PY2:
    from django.utils.encoding import smart_unicode, force_unicode

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

# used as py3 urllib.
# @see https://pythonhosted.org/six/#module-six.moves
urllib = six.moves.urllib

def urlopen(*args, **kwargs):
    return urllib.request.urlopen(*args, **kwargs)

def http_get(url, encoding="utf-8"):
    """
    >>> None != http_get("https://www.google.com")
    True
    """
    return urlopen(url).read().decode(encoding)