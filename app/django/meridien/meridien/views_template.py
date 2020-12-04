from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework import status

@csrf_exempt
def obj_list(request, obj, obj_serializer_class):
    if request.method == 'GET':
        objs = obj.objects.all()
        obj_serializer = obj_serializer_class(objs, many=True)
        return JsonResponse(obj_serializer.data, safe=False)
    elif request.method == 'POST':
        obj_data = JSONParser().parse(request)
        obj_serializer = obj_serializer_class(data=obj_data)
        if obj_serializer.is_valid():
            obj_serializer.save()
            return JsonResponse(obj_serializer.data, status=status.HTTP_201_CREATED)
        return JsonResponse(obj_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        obj.objects.all().delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt
def obj_detail(request, pk, obj, obj_serializer_class):
    try:
        objs = obj.objects.get(pk=pk)
    except obj.DoesNotExist:
        return HttpResponse(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        obj_serializer = obj_serializer_class(objs)
        return JsonResponse(obj_serializer.data)
    elif request.method == 'PUT':
        obj_data = JSONParser().parse(request)
        obj_serializer = obj_serializer_class(objs, data=obj_data)
        if obj_serializer.is_valid():
            obj_serializer.save()
            return JsonResponse(obj_serializer.data)
        return JsonResponse(obj_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        objs.delete()
        return HttpResponse(status=status.HTTP_204_NO_CONTENT)
