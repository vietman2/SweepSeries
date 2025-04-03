from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from ..models import User
from ..serializers import UserSerializer, UserAuthSerializer

class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    http_method_names = ['get']

    def get_permissions(self):
        if self.action == 'me':
            return [IsAuthenticated()]

        return [AdminOnly()]

    def list(self, request, *args, **kwargs):
        #role = request.query_params.get('role', None)
        q = Q()
        q &= Q(is_superuser=False)

        queryset = self.get_queryset().filter(q)

        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="유저 정보 조회", tags=["유저"])
    @action(detail=False, methods=['get'])
    def me(self, request, *args, **kwargs): ## pylint: disable=unused-argument
        full = request.query_params.get('full', False)
        profile_id = request.query_params.get('profile_id', None)

        user = request.user
        if full:
            serializer = UserSerializer(user)
            serializer.context['profile_id'] = profile_id
        else:
            serializer = UserAuthSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)
