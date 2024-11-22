from rest_framework import serializers

from .models import Tag

class TagSerializer(serializers.ModelSerializer):
    forum_id = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['id', 'forum_id', 'name', 'icon', 'color', 'bgcolor']

    def get_forum_id(self, obj):
        return obj.forum
