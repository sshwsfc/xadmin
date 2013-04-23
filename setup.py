from setuptools import setup

setup(
    name='django-xadmin',
    version='0.1.1',
    description='Drop-in replacement of Django admin comes with lots of goodies, fully extensible with plugin support, pretty UI based on Twitter Bootstrap.',
    author='sshwsfc',
    author_email='sshwsfc@gmail.com',
    url='http://xadmin.io',
    download_url='',
    packages=['xadmin'],
    include_package_data=True,
    zip_safe=False,
    classifiers=[
        'Development Status :: 1 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Framework :: Django',
    ]
)
