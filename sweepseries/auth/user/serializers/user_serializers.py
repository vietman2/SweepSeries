from rest_framework import serializers

from auth.person.serializers import PersonSerializer
from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from product.academy.models import Academy
from product.coach.models import Coach
from ..models import User

class UserAuthSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    profile     = serializers.SerializerMethodField(read_only=True)
    mode        = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'profile', 'mode']

    def get_profile(self, obj):
        first_profile = UserProfile.objects.filter(user=obj).first()

        return UserProfileSerializer(first_profile).data

    def get_mode(self, obj):
        ## 아카데미 대표이거나 코치인 경우 "pro"
        ## 그 외의 경우 "normal"
        if Academy.objects.filter(owner=obj).exists():
            return 'pro'

        if Coach.objects.filter(person__user=obj).exists():
            return 'pro'

        return 'normal'

class UserRelatedSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    name   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'name']

    def get_name(self, obj):
        return obj.person.name

class UserSerializer(serializers.ModelSerializer):
    uuid                = serializers.UUIDField(read_only=True)
    username            = serializers.CharField(read_only=True)
    email               = serializers.EmailField(read_only=True)
    person              = PersonSerializer(read_only=True)
    joined_at           = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')
    profiles            = serializers.SerializerMethodField(read_only=True)
    selected_profile    = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'uuid', 'username', 'email', 'person', 'joined_at', 'profiles', 'selected_profile'
        ]

    def get_profiles(self, obj):
        profile_id = self.context.get('profile_id', None)

        if profile_id:
            return None

        profiles = UserProfile.objects.filter(user=obj)

        return UserProfileSerializer(profiles, many=True).data

    def get_selected_profile(self, obj):  ## pylint: disable=unused-argument
        profile_id = self.context.get('profile_id', None)

        if not profile_id:
            return None

        profile = UserProfile.objects.get(id=profile_id)

        return UserProfileSerializer(profile).data
