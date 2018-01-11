# coding: utf-8
import django

django_ver = django.VERSION[0:2]
DJANGO_8  = (1, 8) == django_ver
DJANGO_9  = (1, 9) == django_ver
DJANGO_10 = (1, 10) == django_ver
DJANGO_11 = (1, 11) == django_ver
DJANGO2   = (2, 0) == django_ver
DJANGO2_1 = (2, 1) == django_ver


class DjangoVersion:
    """
    Use for compare django version.
    >>> import django; django.VERSION = (1, 9, 0, 'final', 0) # actual version of django
    >>> DjangoVersion.high_than(1, 8) and DjangoVersion.high_than(1, 8, 999)
    True
    >>> DjangoVersion.low_than(1, 10) and DjangoVersion.low_than(1, 10, 0)
    True
    >>> DjangoVersion.equals(1, 9) and DjangoVersion.equals(1, 9, 0)
    True
    """
    @staticmethod
    def high_than(major_ver, minor_ver, patch_ver=0):
        """
        Comparing if the version of django is greater or equal than the args.
        :return:
        """
        return django.VERSION[0:3] > (major_ver, minor_ver, patch_ver)

    @staticmethod
    def low_than(major_ver, minor_ver, patch_ver=0):
        """
        Comparing if the version of django is less than the args.
        """
        return django.VERSION[0:3] < (major_ver, minor_ver, patch_ver)

    @staticmethod
    def equals(major_ver, minor_ver, patch_ver=None):
        if patch_ver is None:
            return django.VERSION[0:2] == (major_ver, minor_ver)
        return django.VERSION[0:3] == (major_ver, minor_ver, patch_ver)
    pass
django_version = DjangoVersion



