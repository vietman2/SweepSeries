from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .models import Notice
from .serializers import NoticeSerializer, NoticeFullSerializer

class NoticeViewSet(ModelViewSet):
    queryset = Notice.objects.all()
    serializer_class = NoticeSerializer
    http_method_names = ['get', 'post', 'delete', 'put']

    def get_permissions(self):
        any_actions = ['list', 'retrieve']
        if self.action in any_actions:
            return [AllowAny()]
        return [AdminOnly()]

    def list(self, request, *args, **kwargs):
        user = request.user
        if user.is_superuser and is_admin_page(request):
            queryset = self.get_queryset()
            serializer = NoticeFullSerializer(queryset, many=True)
        else:
            queryset = self.get_queryset().filter(is_deleted=False)
            serializer = NoticeSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.is_deleted = True
        instance.updated_at = timezone.now()
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
