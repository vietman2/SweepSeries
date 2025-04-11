from rest_framework import serializers

from core.utils import get_presigned_url
from product.academy.serializers import AcademyProfileSerializer
from ..models import Coach, CoachProfession

class CoachProfessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoachProfession
        fields = ["id", "kor_name"]

class CoachProfileSerializer(serializers.ModelSerializer):
    name            = serializers.CharField(source="person.name", read_only=True)
    academy         = serializers.SerializerMethodField()
    profile_image   = serializers.SerializerMethodField()

    class Meta:
        model = Coach
        fields = ["uuid", "name", "profile_image", "academy"]

    def get_profile_image(self, obj):
        return get_presigned_url(obj.profile_image)

    def get_academy(self, obj):
        serializer = AcademyProfileSerializer(obj.academy)
        return serializer.data

class CoachSimpleSerializer(serializers.ModelSerializer):
    name            = serializers.SerializerMethodField(read_only=True)
    career          = serializers.CharField(read_only=True, source="get_career_display")
    profile_image   = serializers.SerializerMethodField(read_only=True)
    professions     = CoachProfessionSerializer(many=True, read_only=True)
    rating          = serializers.SerializerMethodField(read_only=True)
    num_reviews     = serializers.SerializerMethodField(read_only=True)
    is_liked        = serializers.SerializerMethodField(read_only=True)
    instagram       = serializers.SerializerMethodField()
    blog            = serializers.CharField(read_only=True)
    academy_uuid    = serializers.UUIDField(read_only=True, source="academy.uuid")

    class Meta:
        model = Coach
        fields = [
            "uuid", "name", "career", "profile_image", "introduction", "professions",
            "rating", "num_reviews", "is_liked", "instagram", "blog", "academy_uuid",
        ]

    def get_name(self, obj):
        return obj.person.name

    def get_profile_image(self, obj):
        return get_presigned_url(obj.profile_image)

    def get_rating(self, obj):
        return obj.cached_rating

    def get_num_reviews(self, obj):
        return obj.num_reviews

    def get_is_liked(self, obj):
        ## context request might not be available in some cases
        request = self.context.get('request')
        user = request.user if request else None
        if user is None or not user.is_authenticated:
            return False

        return obj.likes.filter(user=user).exists()

    def get_instagram(self, obj):
        return f"https://www.instagram.com/{obj.instagram}"

class CoachStatusSerializer(serializers.ModelSerializer):
    name            = serializers.SerializerMethodField(read_only=True)
    academy         = serializers.SerializerMethodField(read_only=True)
    certificate     = serializers.SerializerMethodField()
    verified_at     = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Coach
        fields = [
            "uuid", "name", "is_verified", "academy", "certificate", 
            "is_rejected", "verified_at", "reject_reason"
        ]

    def get_name(self, obj):
        return obj.person.name

    def get_academy(self, obj):
        return obj.academy.name

    def get_certificate(self, obj):
        return get_presigned_url(obj.certificate)
