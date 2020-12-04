from meridien.settings.local import *

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailgun.org'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('MERIDIEN_EMAIL_USER')
EMAIL_HOST_PASSWORD = os.getenv('MERIDIEN_EMAIL_PASSWORD')