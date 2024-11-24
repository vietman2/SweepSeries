from rest_framework import serializers

from community.enums import ForumChoices
from .models import Tag

class TagSerializer(serializers.ModelSerializer):
    forum_id    = serializers.SerializerMethodField(read_only=True)
    forum_name  = serializers.CharField(source='get_forum_display')

    class Meta:
        model = Tag
        fields = ['id', 'forum_id', 'forum_name', 'name', 'icon', 'color', 'bgcolor']

    def get_forum_id(self, obj):
        return obj.forum

    def validate_forum_name(self, value):
        for choice in ForumChoices.choices:
            if value == choice[1]:
                return choice

        raise serializers.ValidationError('Invalid forum name')

    def save(self, **kwargs):
        forum = self.validated_data.pop('get_forum_display')

        self.validated_data['forum'] = forum[0]

        return super().save(**kwargs)
