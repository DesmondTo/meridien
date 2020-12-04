from items.models import Item, BookedItem
from items.serializers import ItemSerializer, BookedItemSerializer

from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

import sys
sys.path.append('../')
from meridien import views_template
@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
@csrf_exempt
def item_list(request):
    return views_template.obj_list(request, Item, ItemSerializer)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def item_detail(request, pk):
    return views_template.obj_detail(request, pk, Item, ItemSerializer)

@api_view(['GET', 'POST', 'DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def booked_item_list(request):
    return views_template.obj_list(request, BookedItem, BookedItemSerializer)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])    
@csrf_exempt
def booked_item_detail(request, pk):
    return views_template.obj_detail(request, pk, BookedItem, BookedItemSerializer)

@api_view(['GET', 'DELETE'])
@permission_classes([IsAuthenticatedOrReadOnly])
@csrf_exempt
def booked_item_from_booking_id(request, booking_id):
    items = BookedItem.objects.filter(booking_source=booking_id)
    
    if request.method == 'GET':
        booked_item_serializer = BookedItemSerializer(items, many=True)
        return JsonResponse(booked_item_serializer.data, safe=False)
    elif request.method == 'DELETE':
        items.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

def booked_item_from_item(request, item_id):
    items = BookedItem.objects.filter(item=item_id)

    if request.method == 'GET':
        booked_item_serializer = BookedItemSerializer(items, many=True)
        return JsonResponse(booked_item_serializer.data, safe=False)
