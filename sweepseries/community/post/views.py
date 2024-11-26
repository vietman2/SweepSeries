from django.db.models import Q
#from django.utils import timezone
from rest_framework import status
#from rest_framework.decorators import action
#from rest_framework.exceptions import ValidationError
#from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

#from community.permissions import IsOwner
from auth.userprofile.models import UserProfile
from community.tag.models import Tag
from community.tag.serializers import TagSerializer
from community.utils import get_forum
from .models import Post
from .serializers import PostSimpleSerializer, PostDetailSerializer

class PostViewSet(ModelViewSet):
    queryset = Post.objects.filter(is_deleted=False)
    serializer_class = PostSimpleSerializer
    permission_classes = [] # TODO: remove this
    http_method_names = ['get']
    """
    def get_permissions(self):
        login_needed = ['create', 'partial_update', 'destroy']
        must_be_owner = ['partial_update', 'destroy']

        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_owner:
            permissions.append(IsOwner())

        return permissions"""

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
            user = request.user if request.user.is_authenticated else None
            serializer.context['user'] = user

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
