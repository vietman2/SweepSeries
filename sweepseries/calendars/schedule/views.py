from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import Schedule, Lesson, Session
from .serializers import (
    ScheduleSerializer, LessonSerializer, SessionDetailSerializer
)

class ScheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @extend_schema(summary="일정 생성", tags=["일정"])
    def create(self, request, *args, **kwargs):
        serializer = ScheduleSerializer(data=request.data)
        serializer.context['request'] = request

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LessonViewSet(ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @extend_schema(summary="레슨 생성", tags=["레슨"])
    def create(self, request, *args, **kwargs):
        serializer = LessonSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨이 성공적으로 생성되었습니다."},
            status=status.HTTP_201_CREATED
        )

class SessionViewSet(ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionDetailSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    @extend_schema(exclude=True)
    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="레슨 상세 조회", tags=["레슨"])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="레슨 수정", tags=["레슨"])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨이 성공적으로 수정되었습니다."},
            status=status.HTTP_200_OK
        )
