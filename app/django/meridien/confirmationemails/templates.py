from django.core.mail import send_mail

from confirmationemails.models import ConfirmationEmail
from confirmationemails.tokens import generate_token


def send_confirmation_email(booking_data):
    confirmation_template = ConfirmationEmail.objects.first()
    confirmation_body = confirmation_template.template.replace(
        confirmation_template.link_string,
        make_link_element(generate_token(booking_data['id']))
    )
    send_mail(
        subject=confirmation_template.subject,
        message='',
        from_email='confirmation@example.com',
        recipient_list=[booking_data['email']],
        html_message=confirmation_body
    )


def make_link_element(token):
    url = 'http://localhost:4200' + '/confirm_booking' + '?token=' + token
    link_element_format = '<a href="{url}">{url}</a>'
    return link_element_format.format(url=url)

