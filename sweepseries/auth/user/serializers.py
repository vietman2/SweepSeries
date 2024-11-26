from rest_framework import serializers

from auth.person.serializers import PersonSerializer
from auth.userprofile.serializers import UserProfileSerializer
from .models import User

class UserAuthSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    profiles    = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'profiles']

    def get_profiles(self, obj):
        return obj.profiles.values_list('id', flat=True)

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
