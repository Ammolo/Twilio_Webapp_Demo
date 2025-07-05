from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from courseapp.serializers.callhistory import CreateSerializer
from courseapp.models import Call

class CallHistoryView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        #Send the entire call history that a user as made, arangerd by "created" and date is filterd to look good on the front end
        
        calls = Call.objects.filter(manage_by=request.user).order_by('-start')
        serializer = CreateSerializer(calls, many=True)
        formatted_data = []
        for call_data in serializer.data:
            call_data['start'] = call_data['start'].replace('T', ' ')[8:10] + '/' + call_data['start'].replace('T', ' ')[5:7] + '/' + call_data['start'].replace('T', ' ')[:4] + ' ' + call_data['start'].replace('T', ' ')[11:19] # formats the datetime to something that looks better
            formatted_data.append(call_data)
        return Response(formatted_data, status=status.HTTP_200_OK)



