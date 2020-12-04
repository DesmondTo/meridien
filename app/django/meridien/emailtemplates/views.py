from django.views.decorators.csrf import csrf_exempt

from emailtemplates.models import EmailTemplate
from emailtemplates.serializers import EmailtemplateSerializer

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

import sys
sys.path.append('../')
from meridien import views_template

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def email_template_list(request):
    return views_template.obj_list(request, EmailTemplate, EmailtemplateSerializer)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def email_template_detail(request, pk):
    return views_template.obj_detail(request, pk, EmailTemplate, EmailtemplateSerializer)
