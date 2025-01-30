from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .models import UserProfile
from .permissions import IsSelf
from .serializers import UserProfileSerializer, UserProfileImageSerializer

class UserProfileViewSet(ModelViewSet):
    serializer_class = UserProfileSerializer
    queryset = UserProfile.objects.all()
    permission_classes = [IsSelf]
    http_method_names = ['patch']

    @extend_schema(summary="프로필 수정", tags=["프로필"])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(data=e.detail, status=e.status_code)

        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    @extend_schema(summary="프로필 사진 수정", tags=["프로필"])
    def image(self, request, pk=None):  ## pylint: disable=unused-argument
        instance = self.get_object()
        serializer = UserProfileImageSerializer(instance, data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(data=e.detail, status=e.status_code)

        return Response(status=status.HTTP_200_OK)
