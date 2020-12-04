from django.conf.urls import url
from confirmationemails import views

urlpatterns = [
    url('update_confirmation', views.create_or_update_confirmation_template),
    url('get_confirmation', views.get_confirmation_template),
    url('resend_confirmation', views.resend_confirmation)
]
