from rest_framework.permissions import BasePermission

class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.person.user == request.user

class IsCoachAcademyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.academy.owner == request.user
