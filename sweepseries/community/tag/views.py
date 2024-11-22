from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from community.enums import ForumChoices
from .models import Tag
from .serializers import TagSerializer

class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    http_method_names = ['get']

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary='태그 목록 조회', tags=['태그'])
    def list(self, request, *args, **kwargs):
        ## create list for each forum. get forums in their display name
        forum_tags = {}
        for forum in ForumChoices:
            forum_tags[forum.label] = self.get_serializer(
                self.queryset.filter(forum=forum.value),
                many=True
            ).data

        return Response(forum_tags, status=status.HTTP_200_OK)
