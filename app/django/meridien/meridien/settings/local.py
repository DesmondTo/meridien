from meridien.settings.base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '8ka@=25ffr7377i_s*$$6n_=sepb1jpwhrbbgviphal7q=(3zz'

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
   'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'PASSWORD': 'sooperuser',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# CORS settings
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    'http://localhost:4200',
    'http://127.0.0.1:4200',
)

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
