from django.urls import path
from mails import views

urlpatterns = [
    path('send_html_email', views.mail)
]
