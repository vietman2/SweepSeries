from rest_framework.permissions import BasePermission

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        calendar_users = obj.calendaruser_set.all()

        calendar_user = calendar_users.filter(user=request.user).first()

        if not calendar_user:
            return False

        return calendar_user.auth == 'OWNER'

class IsMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        calendar_users = obj.calendaruser_set.all()

        calendar_user = calendar_users.filter(user=request.user).first()

        if not calendar_user:
            return False

        return True
