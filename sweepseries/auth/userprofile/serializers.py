from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import UserProfile

class UserProfileSerializer(ModelSerializer):
    id              = serializers.IntegerField(read_only=True)
    name            = serializers.CharField(read_only=True, source='user.person.name')
    profile_image   = serializers.URLField(read_only=True)
    color           = serializers.CharField(source='default_color', read_only=True)
    nickname        = serializers.CharField(read_only=True)
    introduction    = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "name",
            "profile_image",
            "color",
            "nickname",
            "introduction",
        ]
