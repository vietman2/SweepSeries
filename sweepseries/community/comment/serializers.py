from rest_framework import serializers

from auth.userprofile.serializers import UserProfileSerializer
from community.utils import get_time_since_created
from .models import Comment, ReComment

class RecommentSerializer(serializers.ModelSerializer):
    author          = UserProfileSerializer()
    created_at      = serializers.SerializerMethodField()
    num_likes       = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()
    is_author       = serializers.SerializerMethodField()

    class Meta:
        model = ReComment
        fields = [
            'id',
            'author',
            'content',
            'created_at',
            'num_likes',
            'is_liked',
            'is_author'
        ]

    def get_created_at(self, obj):
        return get_time_since_created(obj.created_at)

    def get_num_likes(self, obj):
        return obj.recomment_likes.count()

    def get_is_liked(self, obj):
        profile = self.context.get('profile', None)
        if not profile:
            return False
        return obj.recomment_likes.filter(user=profile).exists()

    def get_is_author(self, obj):
        profile = self.context.get('profile', None)
        if not profile:
            return False
        return obj.author.user == profile.user

class CommentSerializer(serializers.ModelSerializer):
    author          = UserProfileSerializer()
    created_at      = serializers.SerializerMethodField()
    num_likes       = serializers.SerializerMethodField()
    num_recomments  = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()
    is_author       = serializers.SerializerMethodField()
    recomments      = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id',
            'author',
            'content',
            'created_at',
            'num_likes',
            'num_recomments',
            'is_liked',
            'is_author',
            'recomments'
        ]

    def get_created_at(self, obj):
        return get_time_since_created(obj.created_at)

    def get_num_likes(self, obj):
        return obj.comment_likes.count()

    def get_num_recomments(self, obj):
        return obj.recomments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        profile = self.context.get('profile', None)
        if not profile:
            return False
        return obj.comment_likes.filter(user=profile).exists()

    def get_is_author(self, obj):
        profile = self.context.get('profile', None)
        if not profile:
            return False
        return obj.author.user == profile.user

    def get_recomments(self, obj):
        recomments = obj.recomments.filter(is_deleted=False, recomment_reports__isnull=True)
        recomments.order_by('-created_at')

        serializer = RecommentSerializer(recomments, many=True)
        serializer.context['profile'] = self.context.get('profile', None)

        return serializer.data
