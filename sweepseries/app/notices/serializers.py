from django.utils import timezone
from rest_framework import serializers

from .models import Notice

class NoticeSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'created_at', 'updated_at']

    def validate(self, data):
        if not data.get('content'):
            raise serializers.ValidationError("Content is required.")
        if not data.get('title'):
            raise serializers.ValidationError("Title is required.")
        return data

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.updated_at = timezone.now()
        instance.save()
        return instance

class NoticeFullSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Notice
        fields = "__all__"
