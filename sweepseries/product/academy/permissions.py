from rest_framework.permissions import BasePermission

class IsAcademyOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class IsAcademyStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        if obj.owner == request.user:
            ## 아카데미 소유자
            return True

        academy_coaches = obj.coaches.all()
        for coach in academy_coaches:
            if coach.person.user == request.user:
                ## 코치
                return True

        return False
