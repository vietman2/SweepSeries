from rest_framework.permissions import BasePermission

from .utils import is_admin_page

class AdminOnly(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_superuser

class AdminPageOnly(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.is_superuser and is_admin_page(request)
