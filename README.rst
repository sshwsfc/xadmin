Xadmin |Build Status|
============================================

.. |Build Status| image:: https://travis-ci.org/sshwsfc/xadmin.png?branch=master
   :target: https://travis-ci.org/sshwsfc/xadmin

Drop-in replacement of Django admin comes with lots of goodies, fully extensible with plugin support, pretty UI based on Twitter Bootstrap.

Live Demo
---------

http://demo.xadmin.io

-  User: admin
-  Password: admin

Features
--------

-  Drop-in replacement of Django admin
-  Twitter Bootstrap based UI with theme support
-  Extensible with plugin support
-  Better filter, date range, number range, etc.
-  Built-in data export with xls, csv, xml and json format
-  Dashboard page with widget support
-  In-site bookmarking
-  Full CRUD methods

Screenshots
-----------

.. figure:: https://raw.github.com/sshwsfc/django-xadmin/docs-chinese/docs/images/plugins/action.png
   :alt: Actions
   
.. figure:: https://raw.github.com/sshwsfc/django-xadmin/docs-chinese/docs/images/plugins/filter.png
   :alt: Filter

.. figure:: https://raw.github.com/sshwsfc/django-xadmin/docs-chinese/docs/images/plugins/chart.png
   :alt: Chart

.. figure:: https://raw.github.com/sshwsfc/django-xadmin/docs-chinese/docs/images/plugins/export.png
   :alt: Export Data

.. figure:: https://raw.github.com/sshwsfc/django-xadmin/docs-chinese/docs/images/plugins/editable.png
   :alt: Edit inline

Get Started
-----------

Install
^^^^^^^

Xadmin is best installed via PyPI. To install the latest version, run:

.. code:: bash

    pip install xadmin

or Install from github source:

.. code:: bash

    pip install git+git://github.com/sshwsfc/xadmin.git

Install from github source for Django 2.0:

.. code:: bash

    pip install https://codeload.github.com/sshwsfc/xadmin/zip/django2

Install Requires 
----------------

-  `django`_ >=2

-  `django-crispy-forms`_ >=1.6.0 (For xadmin crispy forms)

-  `django-reversion`_ ([OPTION] For object history and reversion feature, please select right version by your django, see `changelog`_ )

-  `django-formtools`_ ([OPTION] For wizward form)

-  `xlwt`_ ([OPTION] For export xls files)

-  `xlsxwriter`_ ([OPTION] For export xlsx files)

.. _django: http://djangoproject.com
.. _django-crispy-forms: http://django-crispy-forms.rtfd.org
.. _django-reversion: https://github.com/etianen/django-reversion
.. _changelog: https://github.com/etianen/django-reversion/blob/master/CHANGELOG.rst
.. _django-formtools: https://github.com/django/django-formtools
.. _xlwt: http://www.python-excel.org/
.. _xlsxwriter: https://github.com/jmcnamara/XlsxWriter

Documentation
-------------

-  English (coming soon)
-  `Chinese`_

.. _Chinese: https://xadmin.readthedocs.org/en/latest/index.html

Changelogs
-------------

0.6.0
^^^^^
- Compact with Django1.9.
- Add Clock Picker widget for timepicker.
- Fixed some userface errors.

0.5.0
^^^^^
    
- Update fontawesome to 4.0.3
- Update javascript files to compact fa icons new version
- Update tests for the new instance method of the AdminSite class
- Added demo graphs
- Added quickfilter plugin.
- Adding apps_icons with same logic of apps_label_title.
- Add xlsxwriter for big data export.
- Upgrade reversion models admin list page.
- Fixed reverse many 2 many lookup giving FieldDoesNotExist error.
- Fixed user permission check in inline model.

`Detail`_

.. _Detail: ./changelog.md

Online Group
------------

-  QQ群 : 282936295

Run Demo Locally
----------------

.. code:: bash

    cd demo_app
    ./manage.py migrate
    ./manage.py runserver

Open http://127.0.0.1:8000 in your browser, the admin user password is ``admin``

Help
----

Help Translate : http://trans.xadmin.io

