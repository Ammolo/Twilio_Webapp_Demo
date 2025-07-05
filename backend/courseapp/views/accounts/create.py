from courseapp.serializers.accounts import CreateSerializer
from courseapp.permissions import HasGroupPermission

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# @permission_required('courseapp.accounts.create')
class CreateView(APIView):
     
	permission_classes = (IsAuthenticated, )
	permission_classes = [HasGroupPermission]
	permission_groups = ['admin']
	
	def post(self, request):
		serializer = CreateSerializer(data=request.data)

		if serializer.is_valid():
			user = serializer.save()

			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
			
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
