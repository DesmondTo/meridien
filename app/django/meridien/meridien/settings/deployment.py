import os

from meridien.settings.base import *

# Security

DEBUG = False

SECRET_KEY = os.getenv('MERIDIEN_SECRET_KEY')

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases

DATABASES = {
   'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('MERIDIEN_DJANGO_DB_NAME'),
        'USER': os.getenv('MERIDIEN_DJANGO_DB_USER'),
        'PASSWORD': os.getenv('MERIDIEN_DJANGO_DB_PASSWORD'),
        'HOST': os.getenv('MERIDIEN_DJANGO_DB_HOST'),
        'PORT': 5432,
    }
}

# CORS settings
CORS_ORIGIN_ALLOW_ALL = False
CORS_ORIGIN_WHITELIST = (
    os.getenv('MERIDIEN_FRONT_END_DOMAIN'),
)

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('MERIDIEN_EMAIL_USER')
EMAIL_HOST_PASSWORD = os.getenv('MERIDIEN_EMAIL_PASSWORD')

# Communication settings

ALLOWED_HOSTS += [
    os.getenv('MERIDIEN_DOMAIN')
]

CSRF_COOKIE_SECURE = True

SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_HSTS_SECONDS = 60
SECURE_REFERRER_POLICY = 'same-origin'
SECURE_SSL_REDIRECT = True

SESSION_COOKIE_SECURE = True
