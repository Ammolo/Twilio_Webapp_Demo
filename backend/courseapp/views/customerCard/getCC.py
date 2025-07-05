from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

import csv, io
import pandas as pd
from django.http import JsonResponse
from courseapp.models import CustomerInfo

from rest_framework.response import Response
from rest_framework.views import APIView

def GetCC(request):
    if request.method == 'GET':
        #Get the next customer with Pending status        
        data = CustomerInfo.objects.filter(status='P').first()

        # #Set and update customer status to In Progess
        data.status = 'I'
        data.save()
    
        #Create response from to send back to front end
        response = {
            'id': data.id,
            'firstName': data.firstName,
            'lastName': data.lastName,
            'age': data.age,
            'gender': data.gender,
            'email': data.email,
            'phone': data.phone,
            'address': data.address,
            'zipcode':data.zipcode
        }

    return JsonResponse(response)
    