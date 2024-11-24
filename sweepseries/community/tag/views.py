from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from community.enums import ForumChoices
from .models import Tag
from .serializers import TagSerializer

class TagViewSet(ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    @extend_schema(summary='태그 조회', tags=['태그'])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

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

    @extend_schema(summary='태그 생성', tags=['태그'])
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        read_serializer = TagSerializer(serializer.instance)

        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary='태그 수정', tags=['태그'])
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary='태그 삭제', tags=['태그'])
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
