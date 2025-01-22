from rest_framework.permissions import BasePermission

from .enums import AuthChoices

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        calendar_users = obj.calendar_users.all()

        calendar_user = calendar_users.filter(user=request.user).first()

        if not calendar_user:
            return False

        return calendar_user.auth == AuthChoices.OWNER

class IsMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        calendar_users = obj.calendar_users.all()

        calendar_user = calendar_users.filter(user=request.user).first()

        if not calendar_user:
            return False

        return True
