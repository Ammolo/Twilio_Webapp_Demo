import os
import pandas as pd
import json
from django.test import TestCase
from courseapp.models import CustomerInfo


from django.core.files.uploadedfile import SimpleUploadedFile

class customerCardTest(TestCase):
    def setUp(self):

        # Sample Data
        self.expected_response_json = {
            'firstName': 'LSD',
            'lastName': 'Addict',
            'age': 573,
            'gender': 'M',
            'email': 'LSDabuser@gmail.com',
            'phone': '57337272',
            'address': 'Sniffable line 3',
            'zipcode': 'LSD573',
                
        }
        
        self.expected_response_csv = {
            'firstName': 'Weed',
            'lastName': 'Addict',
            'age': 420,
            'gender': 'M',
            'email': 'WeedSmoker420@gmail.com',
            'phone': '42069420',
            'address': 'Joint street 420',
            'zipcode': '4200',
        }

    def test_insert_ImportCC_json(self):
                
        #insert data JSON:
        response = self.client.post("/card/import",self.expected_response_json)

        #Check if insert fucntion returns 200
        self.assertEqual(response.status_code, 200)

        #Get data from DB to verify insertion
        data = CustomerInfo.objects.get(email=self.expected_response_json["email"])
        
        #for loop to check if data is correctly inserted
        for key, value in self.expected_response_json.items():
            self.assertEqual(getattr(data, key), value)
    
        
    def test_insert_importCC_CSV(self):
        path = 'courseapp/tests/cardtests/SampleData.csv'

        # Creates a pandas dataframe using sample data
        dataframe = pd.DataFrame(data=[self.expected_response_csv])
        
        # create a csv file using dataframe
        dataframe.to_csv(path ,index=False)
        
        #open csv and format post request
        with open(path, 'rb') as f:
            csv_data = f.read()
            csv_file = SimpleUploadedFile('csv.csv', csv_data, content_type = 'multipart/form-data')
            f.close()
        
        # send the post request with the csv file
        response = self.client.post('/card/import', {'csv': csv_file})
        
        #check to see if insert csv returns 200
        self.assertEqual(response.status_code, 200)

        #Get data from DB to verify insertion
        data = CustomerInfo.objects.get(email=self.expected_response_csv["email"])

        #for loop to check if data is correctly inserted
        for key, value in self.expected_response_csv.items():
            self.assertEqual(getattr(data, key), value)

        #Clean up
        if os.path.exists(path=path):
            os.remove(path=path)
        else:
            print("This file dose not exist")

    def test_getCC(self):
        print("Testing get CC")
        
        #insert data into DB
        self.client.post("/card/import",self.expected_response_json)
        self.client.post("/card/import",self.expected_response_csv)
        
        for each in range(2):
            #get request to GetCC requesting customer card
            get_response = self.client.get("/card/getCC")

            #check for HTTP response 200 OK
            self.assertEqual(get_response.status_code, 200)
            
            #turns json into dict
            data = json.loads(get_response.content)
            
            #if else to set correct example response
            if each == 0:
                items = self.expected_response_json.items()
            else:
                items = self.expected_response_csv.items()
                
            #checks to see if the data sendt is correct
            for key, value in items:
                self.assertEqual(data[key], value)
            
            # Cheks if the entry status is updated to in Progress
            status = CustomerInfo.objects.get(id=data["id"])
            self.assertEqual(status.status, "I")