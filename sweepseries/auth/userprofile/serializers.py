from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import UserProfile

class UserProfileSerializer(ModelSerializer):
    profile_image   = serializers.ImageField(use_url=True, read_only=True)
    color           = serializers.CharField(source='default_color', read_only=True)
    nickname        = serializers.CharField(read_only=True)
    introduction    = serializers.CharField(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "profile_image",
            "color",
            "nickname",
            "introduction",
        ]
