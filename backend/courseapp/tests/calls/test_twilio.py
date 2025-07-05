import os
import xmltodict
from django.test import TestCase

#imports calling device for testing
from dotenv import load_dotenv
load_dotenv()

class TwilioTestCase(TestCase):
    
    # setup for test
    def setUp(self):        
        # Loads data from enviroment file
        self.account_sid = os.environ['TWILIO_ACCOUNT_SID']
        self.api_key = os.environ['TWILIO_API_KEY_SID']
        self.api_key_secret = os.environ['TWILIO_API_KEY_SECRET']
        self.twiml_app_sid = os.environ['TWIML_APP_SID']
        self.twilio_number = os.environ['TWILIO_NUMBER']
        
        # "Random" generated number
        self.test_number = '+4712345678'

        # This is the twilio data format which is sendt via a post request to /dialer/handle_calls
        # Self generated to test the calling function
        self.request = {
            'AccountSid': self.account_sid, 
            'ApiVersion': '2010-04-01', 
            'ApplicationSid': self.twiml_app_sid, 
            'CallSid': 'CA91644af53a8da941025ad1f109d14513', 
            'CallStatus': 'ringing', 
            'Called': '',
            'Caller': 'client:' + self.twilio_number, 
            'Direction': 'inbound', 
            'From': 'client:' + self.twilio_number, 
            'To': self.test_number
            }

    def test_get_token(self):

        # Make a GET request to the endpoint
        response = self.client.get("/dialer/token")
        
        # Saves the generated token
        self.token = response.data['token']
        
        # Check for (HTTP 200 OK)
        self.assertEqual(response.status_code, 200)
        
        # Checks if we have gotten a token (simply checks if their is data)
        self.assertIn('token', response.data)
        
        # Cheks if the idcentity is the same as the twilio user phone number
        self.assertEqual(response.data['identity'], self.twilio_number)

    def test_call(self):
        
        # Sends http POST request with self.request
        response = self.client.post("/dialer/handle_call", self.request)
               
        # Turns xml data into a dict and itterates to Dial
        xml_data = response.content.decode()
        xml_dict = xmltodict.parse(xml_data)
        xml_dict = xml_dict.get("Response").get("Dial")
                
        # Cheks for proper status code
        self.assertEqual(response.status_code, 200)
        
        # Cheks if response caller id is equal to the twilio number
        self.assertEqual(xml_dict['@callerId'], self.twilio_number)
        
        # Cheks if response number equals number to dial
        self.assertEqual(xml_dict['Number'], self.test_number)
        
       