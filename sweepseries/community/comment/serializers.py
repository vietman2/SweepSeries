from rest_framework import serializers

from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from community.enums import ReportReason
from community.post.models import Post
from community.utils import get_time_since_created
from .models import Comment, CommentReport, ReComment, ReCommentReport

class RecommentSerializer(serializers.ModelSerializer):
    id              = serializers.IntegerField(read_only=True)
    author          = UserProfileSerializer(read_only=True)
    created_at      = serializers.SerializerMethodField(read_only=True)
    num_likes       = serializers.SerializerMethodField(read_only=True)
    is_liked        = serializers.SerializerMethodField(read_only=True)
    is_author       = serializers.SerializerMethodField(read_only=True)
    is_deleted      = serializers.BooleanField(read_only=True)

    comment         = serializers.IntegerField(write_only=True)
    profile         = serializers.IntegerField(write_only=True)

    class Meta:
        model = ReComment
        fields = [
            'id', 'author', 'content', 'created_at', 'num_likes',
            'is_liked', 'is_author', 'is_deleted', 'comment', 'profile'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.is_deleted:
            representation['content'] = "삭제된 답글입니다."

        return representation

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

    def validate_comment(self, value):
        if not Comment.objects.filter(id=value, is_deleted=False).exists():
            raise serializers.ValidationError("오류가 발생했습니다.")

        comment = Comment.objects.get(id=value)

        return comment

    def validate_profile(self, value):
        if not UserProfile.objects.filter(id=value).exists():
            raise serializers.ValidationError("오류가 발생했습니다.")

        user_profile = UserProfile.objects.get(id=value)
        if not user_profile.user == self.context.get('user', None):
            raise serializers.ValidationError("프로필을 다시 선택해주세요.")

        return user_profile

    def update(self, instance, validated_data):
        if 'content' in validated_data:
            instance.content = validated_data['content']
            instance.save()
            return instance

        raise serializers.ValidationError("오류가 발생했습니다.")

    def create(self, validated_data):
        comment = validated_data.pop('comment')
        profile = validated_data.pop('profile')

        recomment = ReComment.objects.create(
            **validated_data,
            author=profile,
            comment=comment
        )

        return recomment

class CommentSerializer(serializers.ModelSerializer):
    id              = serializers.IntegerField(read_only=True)
    author          = UserProfileSerializer(read_only=True)
    created_at      = serializers.SerializerMethodField(read_only=True)
    num_likes       = serializers.SerializerMethodField(read_only=True)
    num_recomments  = serializers.SerializerMethodField(read_only=True)
    is_liked        = serializers.SerializerMethodField(read_only=True)
    is_author       = serializers.SerializerMethodField(read_only=True)
    is_deleted      = serializers.BooleanField(read_only=True)
    recomments      = serializers.SerializerMethodField(read_only=True)

    post            = serializers.IntegerField(write_only=True)
    profile         = serializers.IntegerField(write_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'author', 'content', 'created_at','num_likes', 'num_recomments',
            'is_liked', 'is_author', 'is_deleted', 'recomments', 'post', 'profile'
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.is_deleted:
            representation['content'] = "삭제된 댓글입니다."

        return representation

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
        recomments = obj.recomments.all()
        recomments.order_by('-created_at')

        serializer = RecommentSerializer(recomments, many=True)
        serializer.context['profile'] = self.context.get('profile', None)

        return serializer.data

    def validate_post(self, value):
        if not Post.objects.filter(id=value, is_deleted=False).exists():
            raise serializers.ValidationError("오류가 발생했습니다.")

        post = Post.objects.get(id=value)

        return post

    def validate_profile(self, value):
        if not UserProfile.objects.filter(id=value).exists():
            raise serializers.ValidationError("오류가 발생했습니다.")

        user_profile = UserProfile.objects.get(id=value)
        if not user_profile.user == self.context.get('user', None):
            raise serializers.ValidationError("프로필을 다시 선택해주세요.")

        return user_profile

    def update(self, instance, validated_data):
        if 'content' in validated_data:
            instance.content = validated_data['content']
            instance.save()
            return instance

        raise serializers.ValidationError("오류가 발생했습니다.")

    def create(self, validated_data):
        post = validated_data.pop('post')
        profile = validated_data.pop('profile')

        comment = Comment.objects.create(
            **validated_data,
            author=profile,
            post=post
        )

        return comment

class CommentReportSerializer(serializers.ModelSerializer):
    report_content  = serializers.CharField(write_only=True)
    report_reason   = serializers.CharField(write_only=True)

    class Meta:
        model = CommentReport
        fields = ["report_content", "report_reason"]

    def validate_report_reason(self, value):
        for reason in ReportReason:
            if value == reason.label:
                return value

        raise serializers.ValidationError('유효하지 않은 신고 사유입니다.')

    def report(self, comment, user):
        if CommentReport.objects.filter(report_user=user, comment=comment).exists():
            raise serializers.ValidationError('이미 신고한 댓글입니다.')

        report = CommentReport.objects.create(
            report_user=user,
            comment=comment,
            report_content=self.validated_data['report_content'],
            report_reason=self.validated_data['report_reason']
        )

        return report

class RecommentReportSerializer(serializers.ModelSerializer):
    report_content  = serializers.CharField(write_only=True)
    report_reason   = serializers.CharField(write_only=True)

    class Meta:
        model = ReCommentReport
        fields = ["report_content", "report_reason"]

    def validate_report_reason(self, value):
        for reason in ReportReason:
            if value == reason.label:
                return value

        raise serializers.ValidationError('유효하지 않은 신고 사유입니다.')

    def report(self, recomment, user):
        if ReCommentReport.objects.filter(report_user=user, recomment=recomment).exists():
            raise serializers.ValidationError('이미 신고한 답글입니다.')

        report = ReCommentReport.objects.create(
            report_user=user,
            recomment=recomment,
            report_content=self.validated_data['report_content'],
            report_reason=self.validated_data['report_reason']
        )

        return report
