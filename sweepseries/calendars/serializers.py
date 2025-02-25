from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from auth.user.models import User
from core.utils import get_presigned_url
from product.academy.models import Academy

class CalendarListSerializer(serializers.ModelSerializer):
    calendars = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['calendars']

    def get_personal_calendar(self, user):
        return {
            'title': user.calendar_title,
            'color': user.calendar_color,
            'notifications': user.notifications,
            'notifications_today': user.notifications_today,
            'daily_time': user.daily_time.strftime('%H:%M') if user.daily_time else None,
            'uuid': user.uuid,
            'role': 'owner',
            'type': 'personal',
        }

    def get_academy_calendar(self, academy, user):
        data = {
            'title': f"{academy.name} 캘린더",
            'color': "#14863E",
            'logo': get_presigned_url(academy.logo),
            'uuid': academy.uuid,
            'num_members': academy.students.count() + academy.coaches.count() + 1,
            'type': 'academy',
        }

        if academy.owner == user:
            data['role'] = 'owner'
            data['notifications'] = academy.notifications
            data['notifications_today'] = academy.notifications_today
            data['scope'] = academy.calendar_scope
            time = academy.daily_time.strftime('%H:%M') if academy.daily_time else None
            data['daily_time'] = time

            return data

        if academy.coaches.filter(person__user=user).exists():
            data['role'] = 'coach'
            academy_coach = academy.coaches.get(person__user=user)
            data['notifications'] = academy_coach.notifications
            data['notifications_today'] = academy_coach.notifications_today
            time = academy_coach.daily_time.strftime('%H:%M') if academy_coach.daily_time else None
            data['daily_time'] = time

            return data

        data['role'] = 'student'
        academy_student = academy.students.get(person=user.person)
        data['notifications'] = academy_student.notifications
        data['notifications_today'] = academy_student.notifications_today
        time = academy_student.daily_time.strftime('%H:%M') if academy_student.daily_time else None
        data['daily_time'] = time

        return data

    def get_calendars(self, obj):
        calendars = []

        calendars.append(self.get_personal_calendar(obj))

        q = Q()
        q |= Q(owner=obj)
        q |= Q(students__person=obj.person)
        q |= Q(coaches__person__user=obj)

        academies = Academy.objects.filter(q).distinct()

        for academy in academies:
            calendars.append(self.get_academy_calendar(academy, obj))

        return calendars
