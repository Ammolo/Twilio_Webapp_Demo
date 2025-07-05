from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class ProfileView(APIView):
     
	permission_classes = (IsAuthenticated, )
	
	def get(self, request):
		content = {
			"current_user": {

				"is_authenticated": request.user.is_authenticated,
				"email": request.user.email
			}
		}
		return Response(content)
