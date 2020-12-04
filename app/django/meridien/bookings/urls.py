from django.conf.urls import url
from django.urls import path
from bookings import views

urlpatterns = [
    url(r'^bookings/$', views.booking_list),
    url(r'^bookings/(?P<pk>[0-9]+)$', views.booking_detail),
    path('bookings/token/<str:token>', views.booking_detail_token),
    path('bookings/token/confirm/<str:token>', views.confirm_booking_token)
]
