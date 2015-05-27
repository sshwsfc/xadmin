DEBUG = True
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
    }
}
MIDDLEWARE_CLASSES = ()
# Required for Django 1.4+
STATIC_URL = '/static/'

# Required for Django 1.5+
SECRET_KEY = 'abc123'
