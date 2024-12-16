from rest_framework import serializers

from .enums import AuthChoices
from .models import CalendarUser

class CalendarSerializer(serializers.ModelSerializer):
    id          = serializers.SerializerMethodField()
    name        = serializers.SerializerMethodField()
    is_owner    = serializers.SerializerMethodField()
    num_members = serializers.SerializerMethodField()

    class Meta:
        model = CalendarUser
        fields = ["id", "name", "color", "is_owner", "num_members"]

    def get_id(self, obj):
        return obj.calendar.id

    def get_name(self, obj):
        return obj.display_name

    def get_is_owner(self, obj):
        return obj.auth == AuthChoices.OWNER

    def get_num_members(self, obj):
        return obj.calendar.calendar_users.count()
