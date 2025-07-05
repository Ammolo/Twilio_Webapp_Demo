from courseapp.serializers.accounts import ChangePasswordSerializer

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ChangePasswordView(APIView):
     
	permission_classes = (IsAuthenticated, )

	def post(self, request):
		serializer = ChangePasswordSerializer(
			data=request.data, 
			context={ 'user': self.request.user }
		)

		if serializer.is_valid():
			user = serializer.save()

			if user:
				return Response({})
			
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
