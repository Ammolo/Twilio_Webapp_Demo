from courseapp.serializers.call import CreateSerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class CreateCallView(APIView):
     
	permission_classes = (IsAuthenticated, )

	def post(self, request):
		serializer = CreateSerializer(
			data=request.data, 
			context={ 'user': self.request.user }
		)

		if serializer.is_valid():
			call = serializer.save()

			if call:
				return Response({})
			
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
