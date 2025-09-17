from rest_framework.permissions import BasePermission

class IsOwnerOrAdmin(BasePermission):
   
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.role in ["owner", "admin"]:
            return True
        # member  only read
        if request.user.role == "member" and request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        return False
