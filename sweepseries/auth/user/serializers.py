from rest_framework import serializers

from auth.person.serializers import PersonSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    email       = serializers.EmailField(read_only=True)
    person      = PersonSerializer(read_only=True)
    joined_at   = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')

    class Meta:
        model = User
        fields = ['uuid', 'username', 'email', 'person', 'joined_at']
