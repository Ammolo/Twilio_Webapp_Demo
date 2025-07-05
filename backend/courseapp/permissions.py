from django.contrib.auth.models import User, Group
from rest_framework import permissions

def is_in_group(user, group_name):
    try:
        return Group.objects.get(name=group_name).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return False

class HasGroupPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        required_groups = view.permission_groups
        
        return required_groups is not None and ( '_Public' in required_groups or any([is_in_group(request.user, group_name) for group_name in required_groups]) ) 
