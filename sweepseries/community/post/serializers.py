from django.utils import timezone
from rest_framework import serializers

from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from community.comment.serializers import CommentSerializer
from community.tag.serializers import TagSerializer
from community.utils import get_time_since_created, get_forum
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

    class Meta:
        model = Post
        fields = [
            'id', 'tag', 'title', 'content', 'image', 'created_at',
            'author', 'num_views', 'num_likes', 'num_comments'
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
        count = 0
        comments = obj.comments.all()
        for comment in comments:
            count += comment.recomments.count()

        return count + comments.count()

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
    is_author       = serializers.SerializerMethodField()
    comments        = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id", "tag", "author", "created_at", "title", "content", "images",
            "num_views", "num_likes", "num_comments", "comments", "is_liked", 'is_author'
        ]

    def get_created_at(self, obj):
        return get_time_since_created(obj.created_at)

    def get_num_likes(self, obj):
        return obj.post_likes.count()

    def get_num_comments(self, obj):
        count = 0
        comments = obj.comments.all()
        for comment in comments:
            count += comment.recomments.count()

        return count + comments.count()

    def get_is_liked(self, obj):
        profile = self.context.get('profile', None)
        if profile is None:
            return False

        return obj.post_likes.filter(user=profile).exists()

    def get_is_author(self, obj):
        profile = self.context.get('profile', None)
        if profile is None:
            return False
        return obj.author.user == profile.user

    def increment_clicks(self):
        ## TODO: Implement Redis to prevent multiple clicks
        self.instance.num_views += 1
        self.instance.save()

        if self.context.get('profile', None) is not None:
            self.content_viewed(self.context['profile'])

    def content_viewed(self, profile):
        view_obj = PostContentView.objects.filter(post=self.instance, user=profile).first()

        if view_obj is None:
            PostContentView.objects.create(post=self.instance, user=profile)
        else:
            view_obj.viewed_last_at = timezone.now()
            view_obj.save()

        return True

    def get_comments(self, obj):
        comments = obj.comments.all()
        comments.order_by('-created_at')

        serializer = CommentSerializer(comments, many=True)
        serializer.context['profile'] = self.context.get('profile', None)

        ## TODO: Think about pagination
        return serializer.data

class PostWriteSerializer(serializers.ModelSerializer):
    author          = serializers.IntegerField(write_only=True)
    forum           = serializers.CharField(write_only=True)

    class Meta:
        model = Post
        fields = ['id', 'forum', 'tag', 'title', 'content', 'author']
        read_only_fields = ['id']
        write_only_fields = ['tag', 'title', 'content', 'author']

    def validate_forum(self, value):
        return get_forum(value)

    def validate_author(self, value):
        if not UserProfile.objects.filter(id=value).exists():
            raise serializers.ValidationError("오류가 발생했습니다.")

        user_profile = UserProfile.objects.get(id=value)
        if user_profile.user != self.context.get('user', None):
            raise serializers.ValidationError("프로필을 다시 선택해주세요.")

        return user_profile

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        return instance
