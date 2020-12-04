from django.urls import path
from emailtemplates import views

urlpatterns = [
    path('email_templates', views.email_template_list),
    path('email_template/<int:pk>', views.email_template_detail)
]