from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from auth.userprofile.models import UserProfile
from community.permissions import IsOwner
from .models import Comment, CommentLike, ReComment, ReCommentLike
from .serializers import CommentSerializer, RecommentSerializer

class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    http_method_names = ['post', 'delete']

    def get_permissions(self):
        must_be_author = ['partial_update', 'destroy']
        permissions = [IsAuthenticated()]

        if self.action in must_be_author:
            permissions.append(IsOwner())

        return permissions

    @extend_schema(summary='댓글 생성', tags=['댓글'])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.context['user'] = request.user

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"message": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary='댓글 삭제', tags=['댓글'])
    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()

        comment.is_deleted = True
        comment.deleted_at = timezone.now()
        comment.save()

        return Response({"message": "댓글이 삭제되었습니다."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    @extend_schema(summary='댓글 좋아요', tags=['댓글'])
    def like(self, request, pk=None):   ## pylint: disable=W0613
        comment = self.get_object()
        profile_id = request.data.get('profile', None)

        if not profile_id:
            return Response({"message": "프로필을 선택해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(id=profile_id)

        if not user_profile.user == request.user:
            return Response({"message": "오류가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)

        if CommentLike.objects.filter(comment=comment, user=user_profile).exists():
            CommentLike.objects.get(comment=comment, user=user_profile).delete()
            return Response({"message": "좋아요가 취소되었습니다."}, status=status.HTTP_200_OK)

        CommentLike.objects.create(comment=comment, user=user_profile)

        return Response({"message": "좋아요가 등록되었습니다."}, status=status.HTTP_200_OK)

class ReCommentViewSet(ModelViewSet):
    queryset = ReComment.objects.all()
    serializer_class = RecommentSerializer
    http_method_names = ['post', 'delete']

    def get_permissions(self):
        must_be_author = ['partial_update', 'destroy']
        permissions = [IsAuthenticated()]

        if self.action in must_be_author:
            permissions.append(IsOwner())

        return permissions

    @extend_schema(summary='대댓글 생성', tags=['대댓글'])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.context['user'] = request.user

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({"message": e.detail}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary='대댓글 삭제', tags=['대댓글'])
    def destroy(self, request, *args, **kwargs):
        recomment = self.get_object()

        recomment.is_deleted = True
        recomment.deleted_at = timezone.now()
        recomment.save()

        return Response({"message": "대댓글이 삭제되었습니다."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    @extend_schema(summary='대댓글 좋아요', tags=['대댓글'])
    def like(self, request, pk=None):   ## pylint: disable=W0613
        recomment = self.get_object()
        profile_id = request.data.get('profile', None)

        if not profile_id:
            return Response({"message": "프로필을 선택해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(id=profile_id)

        if not user_profile.user == request.user:
            return Response({"message": "오류가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)

        if ReCommentLike.objects.filter(recomment=recomment, user=user_profile).exists():
            ReCommentLike.objects.get(recomment=recomment, user=user_profile).delete()
            return Response({"message": "좋아요가 취소되었습니다."}, status=status.HTTP_200_OK)

        ReCommentLike.objects.create(recomment=recomment, user=user_profile)

        return Response({"message": "좋아요가 등록되었습니다."}, status=status.HTTP_200_OK)
