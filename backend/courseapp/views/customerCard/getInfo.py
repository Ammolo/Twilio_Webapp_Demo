from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse
from courseapp.models import CustomerInfo

from rest_framework.response import Response
from rest_framework.views import APIView

@csrf_exempt
def getInfo(request):
    if request.method == 'GET':
        
        # print(request.content_params)
        print(request.GET.get("phone"))
        
        data = CustomerInfo.objects.get(phone=request.GET.get("phone"))
        
        response = data.firstName + " " + data.lastName
        print(response)
        return HttpResponse(content= response ,status = 200)
    else:
        print("Request method")
        return HttpResponse(status = 400)
        