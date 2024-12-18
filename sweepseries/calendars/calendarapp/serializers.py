from rest_framework import serializers

from auth.userprofile.serializers import UserProfileSerializer
from .enums import AuthChoices
from .models import CalendarUser

class CalendarSerializer(serializers.ModelSerializer):
    id              = serializers.SerializerMethodField()
    name            = serializers.SerializerMethodField()
    is_owner        = serializers.SerializerMethodField()
    num_members     = serializers.SerializerMethodField()
    owner           = serializers.SerializerMethodField()
    members         = serializers.SerializerMethodField()
    daily_time      = serializers.TimeField(format="%H:%M", input_formats=["%H:%M:%S"])

    class Meta:
        model = CalendarUser
        fields = [
            "id", "name", "color", "is_owner", "num_members", "owner",
            "members", "notifications", "notifications_today", "daily_time",
        ]

    def get_id(self, obj):
        return obj.calendar.id

    def get_name(self, obj):
        return obj.display_name

    def get_is_owner(self, obj):
        return obj.auth == AuthChoices.OWNER

    def get_num_members(self, obj):
        return obj.calendar.calendar_users.count()

    def get_owner(self, obj):
        owner = obj.calendar.calendar_users.filter(auth=AuthChoices.OWNER).first()
        owner_profile = owner.user.profiles.first()

        return UserProfileSerializer(owner_profile).data

    def get_members(self, obj):
        members = obj.calendar.calendar_users.exclude(auth=AuthChoices.OWNER)
        member_profiles = [member.user.profiles.first() for member in members]

        return UserProfileSerializer(member_profiles, many=True).data
