from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .models import Agreement, AgreementVersion
from .serializers import (
    AgreementSimpleSerializer, AgreementDetailSerializer, AgreementUpdateSerializer
)

class AgreementViewSet(ModelViewSet):
    serializer_class = AgreementSimpleSerializer
    queryset = Agreement.objects.all()
    permission_classes = [AdminOnly]
    http_method_names = ['get', 'post', 'delete', 'put']

    def get_permissions(self):
        if self.action == 'list':
            return [AllowAny()]
        return super().get_permissions()

    def list(self, request, *args, **kwargs):
        user = request.user
        if user.is_superuser and is_admin_page(request):
            queryset = self.get_queryset()
            serializer = AgreementDetailSerializer(queryset, many=True)
        else:
            queryset = Agreement.objects.filter(deleted=False)
            serializer = AgreementSimpleSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AgreementDetailSerializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def create(self, request, *args, **kwargs):
        serializer = AgreementDetailSerializer(data=request.data)
        content = request.data.get('content', None)

        if content == None:
            return Response({'message': '약관 내용을 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        agreement = serializer.save()
        AgreementVersion.objects.create(agreement=agreement, content=content)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        agreement = self.get_object()
        agreement.deleted = True
        agreement.deleted_at = timezone.now()
        agreement.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        agreement = self.get_object()
        serializer = AgreementUpdateSerializer(data=request.data)
        serializer.context['agreement'] = agreement

        try:
            serializer.is_valid(raise_exception=True)
            agreement = serializer.save()
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_200_OK)
