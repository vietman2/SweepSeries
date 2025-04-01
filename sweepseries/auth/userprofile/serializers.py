from django.core.files.storage import default_storage
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from .models import UserProfile

class UserProfileSerializer(ModelSerializer):
    id              = serializers.IntegerField(read_only=True)
    name            = serializers.CharField(read_only=True, source='user.person.name')
    profile_image   = serializers.URLField(read_only=True)
    color           = serializers.CharField(source='default_color', read_only=True)
    nickname        = serializers.CharField()
    introduction    = serializers.CharField(allow_blank=True)
    birthdate       = serializers.DateField(write_only=True, required=False)

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "name",
            "profile_image",
            "color",
            "nickname",
            "introduction",
            "birthdate",
        ]

    def update(self, instance, validated_data):
        instance.nickname = validated_data.get('nickname', instance.nickname)
        instance.introduction = validated_data.get('introduction', instance.introduction)

        user = instance.user
        person = user.person
        person.birth_date = validated_data.get('birthdate', person.birth_date)

        instance.save()
        person.save()

        return instance

class UserProfileImageSerializer(ModelSerializer):
    profile_image = serializers.FileField(write_only=True)

    class Meta:
        model = UserProfile
        fields = [
            "profile_image",
        ]

    def upload_image(self, user, profile_image):
        path = f"users/{user.uuid}/profiles/{profile_image.name}"

        s3_client = default_storage.connection.meta.client
        bucket_name = default_storage.bucket.name

        s3_client.upload_fileobj(
            profile_image,
            bucket_name,
            path,
            ExtraArgs={'ACL': 'public-read'}
        )

        return default_storage.url(path)

    def update(self, instance, validated_data):
        profile_image = validated_data.get('profile_image')

        instance.profile_image = self.upload_image(instance.user, profile_image)
        instance.save()

        return instance
