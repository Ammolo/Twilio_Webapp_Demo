from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

import csv, io
import pandas as pd

from courseapp.models import CustomerInfo

from dotenv import load_dotenv
import os

load_dotenv()
twilio_number = os.environ['TWILIO_NUMBER']

@csrf_exempt
def importCC(request):
    if request.method == 'POST':
        if 'csv' in request.FILES:
            
            data_file = request.FILES['csv']    
            data = pd.read_csv(data_file)


            for index in range(len(data)):
                customer_card = CustomerInfo()
                for attr in data.columns:
                    setattr(customer_card, attr ,data.loc[index, attr])
                
                
                customer_card.save()
                
                # Prints for data inserted
                print(f"id: {customer_card.id}")
                print(f"First Name: {customer_card.firstName}")
                print(f"Last Name: {customer_card.lastName}")
                print(f"Age: {customer_card.age}")
                print(f"Gender: {customer_card.gender}")
                print(f"Email: {customer_card.email}")
                print(f"Phone: {customer_card.phone}")
                print(f"Address: {customer_card.address}")
                print(f"Postal Code: {customer_card.zipcode}")    
                print("")

        else:
            print("TESTING JSON")
            print("")
            print("")
            # If no csv file is posted            
            customer_card = CustomerInfo()
            for attr in request.POST.items():  
                setattr(customer_card, attr[0], attr[1])
                                    
            customer_card.save()    
            
            # Prints for data inserted
            print(f"id: {customer_card.id}")
            print(f"First Name: {customer_card.firstName}")
            print(f"Last Name: {customer_card.lastName}")
            print(f"Age: {customer_card.age}")
            print(f"Gender: {customer_card.gender}")
            print(f"Email: {customer_card.email}")
            print(f"Phone: {customer_card.phone}")
            print(f"Address: {customer_card.address}")
            print(f"Postal Code: {customer_card.zipcode}")    
            print("")
            
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=404)