from django.utils import timezone
from rest_framework import serializers

from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from community.comment.serializers import CommentSerializer
from community.tag.serializers import TagSerializer
from community.utils import get_time_since_created
from core.utils import get_presigned_url
from .models import Post, PostContentView, Image

class PostSimpleSerializer(serializers.ModelSerializer):
    tag             = TagSerializer()
    content         = serializers.SerializerMethodField()
    image           = serializers.SerializerMethodField()
    created_at      = serializers.SerializerMethodField()
    author          = UserProfileSerializer()
    num_likes       = serializers.SerializerMethodField()
    num_comments    = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()
    is_author       = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'tag', 'title', 'content', 'image', 'created_at', 'author',
            'num_views', 'num_likes', 'num_comments', 'is_liked', 'is_author'
        ]

    def get_content(self, obj):
        if len(obj.content) <= 75:
            return obj.content

        return obj.content[:75] + '...'

    def get_image(self, obj):
        if obj.images.exists():
            return get_presigned_url(obj.images.first().image)
        return None

    def get_created_at(self, obj):
        return get_time_since_created(obj.created_at)

    def get_num_likes(self, obj):
        return obj.post_likes.count()

    def get_num_comments(self, obj):
        return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        user = self.context['user']
        return obj.post_likes.filter(user=user).exists()

    def get_is_author(self, obj):
        user = self.context['user']
        return obj.author.user == user

class PostImageSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Image
        fields = ['id', 'url']

    def get_url(self, obj):
        return get_presigned_url(obj.image)

class PostDetailSerializer(serializers.ModelSerializer):
    tag             = TagSerializer()
    author          = UserProfileSerializer()
    created_at      = serializers.SerializerMethodField()
    images          = PostImageSerializer(many=True)
    num_likes       = serializers.SerializerMethodField()
    num_comments    = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()
    comments        = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "tag", "author", "created_at", "title", "content", "images",
            "num_views", "num_likes", "num_comments", "comments", "is_liked"
        ]

    def get_created_at(self, obj):
        return get_time_since_created(obj.created_at)

    def get_num_likes(self, obj):
        return obj.post_likes.count()

    def get_num_comments(self, obj):
        return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        user = self.context.get('user', None)
        if user is None:
            return False

        profiles = UserProfile.objects.filter(user=user)

        if profiles.exists():
            user = profiles.first()
        return obj.post_likes.filter(user=user).exists()

    def increment_clicks(self):
        ## TODO: Implement Redis to prevent multiple clicks
        self.instance.num_views += 1
        self.instance.save()

        if self.context.get('uuid', None) is not None:
            self.content_viewed(self.context['uuid'])

    def content_viewed(self, user_uuid):
        view_obj = PostContentView.objects.filter(post=self.instance, user_uuid=user_uuid).first()

        if view_obj is None:
            PostContentView.objects.create(post=self.instance, user_uuid=user_uuid)
        else:
            view_obj.viewed_last_at = timezone.now()
            view_obj.save()

        return True

    def get_comments(self, obj):
        comments = obj.comments.filter(is_deleted=False, comment_reports__isnull=True)
        comments.order_by('-created_at')

        serializer = CommentSerializer(comments, many=True)
        serializer.context['uuid'] = self.context.get('uuid', None)

        ## TODO: Think about pagination
        return serializer.data
