from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt
from twilio.twiml.voice_response import VoiceResponse, Dial

 
from dotenv import load_dotenv
import os

load_dotenv()
twilio_number = os.environ['TWILIO_NUMBER']
    
@csrf_exempt
def handle_call(request):

    print("")
    print("")
    print("--------------------CALL DEBUG --------------------------")
    
    if request.method == 'POST':

        # Print the form data
        print(request.POST.dict())
        
        # Create a TwiML VoiceResponse
        response = VoiceResponse()
        dial = Dial(callerId=twilio_number)

    # Check if 'To' is in the POST data and is not equal to twilio_number
        if 'To' in request.POST and request.POST['To'] != twilio_number:
            print('OUTBOUND CALL')
            dial.number(request.POST['To'])
        else:
            print('incoming call')
            caller = request.form['Caller']
            dial = Dial(callerId = caller)
            dial.client(twilio_number)

    response = HttpResponse(str(response.append(dial)), content_type='text/xml')
    print(response)
    print("-------------------- END --------------------------")
    return response

    return HttpResponse('')