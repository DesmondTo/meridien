from django.core.mail import send_mail
from django.http.response import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated

from rest_framework import status

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def mail(request):
    if request.method == 'POST':
        email_params = JSONParser().parse(request)
        try:
            send_mail(
                subject=email_params['subject'],
                message='',
                from_email='example@example.com',
                recipient_list=[email_params['recipient']],
                html_message=email_params['message']
            )
            return HttpResponse(status=status.HTTP_204_NO_CONTENT)
        except KeyError as err:
            return JsonResponse({'error': 'Bad request {}'.format(err.args[0])}, status=status.HTTP_400_BAD_REQUEST)
