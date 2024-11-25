from rest_framework import serializers

from auth.userprofile.serializers import UserProfileSerializer
from community.tag.serializers import TagSerializer
from community.utils import get_time_since_created
from core.utils import get_presigned_url
from .models import Post

class PostSimpleSerializer(serializers.ModelSerializer):
    tag             = TagSerializer()
    content         = serializers.SerializerMethodField()
    image           = serializers.SerializerMethodField()
    created_at      = serializers.SerializerMethodField()
    author          = UserProfileSerializer()
    num_likes       = serializers.SerializerMethodField()
    num_comments    = serializers.SerializerMethodField()
    is_liked        = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'tag', 'title', 'content', 'image', 'created_at',
            'author', 'num_views', 'num_likes', 'num_comments', 'is_liked'
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

    def get_num_comments(self, obj):    ## pylint: disable=unused-argument
        ## TODO: remove pylint message
        return 0
        #return obj.comments.filter(is_deleted=False).count()

    def get_is_liked(self, obj):
        user = self.context['user']
        return obj.post_likes.filter(user=user).exists()
