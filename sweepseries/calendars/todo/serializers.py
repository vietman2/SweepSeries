from rest_framework import serializers

from calendars.calendarapp.enums import AuthChoices
from calendars.calendarapp.models import Calendar
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    calendar    = serializers.SerializerMethodField()
    calendar_id = serializers.IntegerField(write_only=True)
    completed   = serializers.BooleanField(read_only=True)

    class Meta:
        model = Todo
        fields = ['id', 'calendar', 'calendar_id', 'title', 'deadline', 'color', 'completed']

    def get_calendar(self, obj):
        return obj.calendar.name

    def create(self, validated_data):
        allowed_auth = [AuthChoices.OWNER, AuthChoices.EDITOR]
        calendar_id = validated_data.pop('calendar_id')
        calendar = Calendar.objects.get(pk=calendar_id)
        user = self.context['request'].user

        if not calendar.calendar_users.filter(user=user, auth__in=allowed_auth).exists():
            raise serializers.ValidationError('권한이 없습니다.')

        return Todo.objects.create(calendar=calendar, **validated_data)
