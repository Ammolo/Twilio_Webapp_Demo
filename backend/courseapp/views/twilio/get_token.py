from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt

from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml.voice_response import VoiceResponse, Dial

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
 
from dotenv import load_dotenv
import os

load_dotenv()

account_sid = os.environ['TWILIO_ACCOUNT_SID']
api_key = os.environ['TWILIO_API_KEY_SID']
api_key_secret = os.environ['TWILIO_API_KEY_SECRET']
twiml_app_sid = os.environ['TWIML_APP_SID']
twilio_number = os.environ['TWILIO_NUMBER']

class GetTokenView(APIView):

    #permission_classes = (IsAuthenticated, )
    def get(self, request):
        
        #Twilio Phone Numver
        identity = twilio_number
        
        #Twiml App Sid
        outgoing_application_sid = twiml_app_sid
        
        #Twilio Access Token Generation
        access_token = AccessToken(account_sid, api_key, api_key_secret, identity=identity)

        #Defines and appends VoiceGrant To Allow for incoming voice
        voice_grant = VoiceGrant(
            outgoing_application_sid=outgoing_application_sid,
            incoming_allow=True,
        )
        access_token.add_grant(voice_grant)
        
        #Creating a response in JSON Format
        response = {
            'token': access_token.to_jwt(),
            'identity': identity
        }

        print('Response IS')
        print(response)

        return Response(response)
