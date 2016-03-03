#!/usr/bin/env python
from setuptools import setup
import sys

# version_tuple = __import__('xadmin.version').VERSION
# version = ".".join([str(v) for v in version_tuple])

setup(
    name='django-xadmin',
    version='0.5.0',
    description='Drop-in replacement of Django admin comes with lots of goodies, fully extensible with plugin support, pretty UI based on Twitter Bootstrap.',
    long_description=open('README.rst').read() if sys.version_info[0] == 2 else open('README.rst', encoding='utf-8').read(),
    author='sshwsfc',
    author_email='sshwsfc@gmail.com',
    license=open('LICENSE').read() if sys.version_info[0] == 2 else open('LICENSE', encoding='utf-8').read(),
    url='http://www.xadmin.io',
    download_url='http://github.com/sshwsfc/django-xadmin/archive/master.zip',
    packages=['xadmin', 'xadmin.plugins', 'xadmin.templatetags', 'xadmin.views'],
    include_package_data=True,
    install_requires=[
        'django==1.7.8',
        'django-crispy-forms>=1.4.0',
    ],
    extras_require={
        'Excel': ['xlwt', 'xlsxwriter'],
        'Reversion': ['django-reversion'],
    },
    zip_safe=False,
    keywords=['admin', 'django', 'xadmin', 'bootstrap'],
    classifiers=[
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        "Programming Language :: JavaScript",
        'Programming Language :: Python',
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3.4",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: Dynamic Content",
        "Topic :: Software Development :: Libraries :: Python Modules",
    ]
)
