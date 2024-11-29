from rest_framework import serializers

from auth.person.serializers import PersonSerializer
from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from .models import User

class UserAuthSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    profile     = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'profile']

    def get_profile(self, obj):
        first_profile = UserProfile.objects.filter(user=obj).first()

        return UserProfileSerializer(first_profile).data

class UserRelatedSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    full_name   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'full_name']

    def get_full_name(self, obj):
        return obj.person.full_name

class UserSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    email       = serializers.EmailField(read_only=True)
    person      = PersonSerializer(read_only=True)
    joined_at   = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')
    profiles    = UserProfileSerializer(many=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'email', 'person', 'joined_at', 'profiles']
