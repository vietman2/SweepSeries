from django.db.models import Q
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
from community.tag.models import Tag
from community.tag.serializers import TagSerializer
from community.utils import get_forum
from core.permissions import AdminOnly
from .models import Post, PostLike, PostReport
from .serializers import (
    PostSimpleSerializer, PostDetailSerializer, PostWriteSerializer, PostReportSerializer
)

class PostViewSet(ModelViewSet):
    queryset = Post.objects.filter(is_deleted=False)
    serializer_class = PostSimpleSerializer
    http_method_names = ['get', 'post', 'delete', 'patch']

    def get_permissions(self):
        login_needed = ['create', 'partial_update', 'destroy', 'like', 'report']
        must_be_owner = ['partial_update', 'destroy']

        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_owner:
            permissions.append(IsOwner())

        return permissions

    @extend_schema(summary='게시글 목록 조회', tags=['게시글'])
    def list(self, request, *args, **kwargs):
        if 'forum' in request.query_params:
            forum = get_forum(request.query_params['forum'])
            q = Q(forum=forum, is_deleted=False, is_under_review=False)

            if 'tag' in request.query_params:
                q &= Q(tag__id=request.query_params['tag'])

            if 'search' in request.query_params:
                search = request.query_params['search']
                q &= Q(title__icontains=search) | Q(content__icontains=search)

            queryset = Post.objects.filter(q).order_by('-created_at')

            serializer = PostSimpleSerializer(queryset, many=True)

            tags = Tag.objects.filter(forum=forum)
            tags = TagSerializer(tags, many=True).data

            ## TODO: Pagination 구현
            return Response({"posts": serializer.data, "tags": tags}, status=status.HTTP_200_OK)

        ## TODO: 내가 쓴 글만 보기 구현
        return Response({'message': "게시판을 선택해주세요."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary='게시글 상세 조회', tags=['게시글'])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PostDetailSerializer(instance)

        user = request.user if request.user.is_authenticated else None
        profile_param = request.query_params.get('profile', None)

        profile_obj = UserProfile.objects.get(pk=profile_param) if profile_param else None

        if profile_obj:
            if profile_obj.user != user:
                return Response({'message': "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

            serializer.context['profile'] = profile_obj

        serializer.increment_clicks()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary='게시글 작성', tags=['게시글'])
    def create(self, request, *args, **kwargs):
        serializer = PostWriteSerializer(data=request.data)
        serializer.context['user'] = request.user

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        detail_serializer = PostDetailSerializer(serializer.instance)

        return Response(detail_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary='게시글 수정', tags=['게시글'])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PostWriteSerializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary='게시글 삭제', tags=['게시글'])
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

        return Response({'message': "게시글이 삭제되었습니다."}, status=status.HTTP_200_OK)

    @extend_schema(summary='게시글 좋아요', tags=['게시글'])
    @action(detail=True, methods=['post'])
    def like(self, request, *args, **kwargs):   ## pylint: disable=unused-argument
        instance = self.get_object()
        profile_id = request.data.get('profile', None)

        if not profile_id:
            return Response({'message': "프로필을 선택해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        user_profile = UserProfile.objects.get(pk=profile_id)

        if not user_profile.user == request.user:
            return Response({'message': "오류가 발생했습니다."}, status=status.HTTP_400_BAD_REQUEST)

        if PostLike.objects.filter(post=instance, user=user_profile.pk).exists():
            PostLike.objects.get(post=instance, user=user_profile.pk).delete()
            return Response({'message': "좋아요가 취소되었습니다."}, status=status.HTTP_200_OK)

        PostLike.objects.create(post=instance, user=user_profile)

        return Response({'message': "좋아요 처리가 완료되었습니다."}, status=status.HTTP_200_OK)

    @extend_schema(summary='게시글 신고', tags=['게시글'])
    @action(detail=True, methods=['post'])
    def report(self, request, *args, **kwargs):   ## pylint: disable=unused-argument
        instance = self.get_object()
        user = request.user

        serializer = PostReportSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.report_post(instance, user)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': "신고가 완료되었습니다."}, status=status.HTTP_200_OK)

class PostReportViewSet(ModelViewSet):
    queryset = PostReport.objects.all()
    serializer_class = PostReportSerializer
    permission_classes = [AdminOnly]
    http_method_names = ['get', 'patch']

    @extend_schema(summary='신고 목록 조회', tags=['게시글'])
    def list(self, request, *args, **kwargs):
        queryset = PostReport.objects.all()
        serializer = PostReportSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary='신고 상세 조회', tags=['게시글'])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PostReportSerializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary='신고 처리', tags=['게시글'])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = PostReportSerializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)
