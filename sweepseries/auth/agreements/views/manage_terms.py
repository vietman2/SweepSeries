from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminPageOnly
from ..models import Agreement, AgreementVersion
from ..serializers import AgreementManagerSerializer, AgreementUpdateSerializer

class AgreementManagerViewSet(ModelViewSet):
    serializer_class = AgreementManagerSerializer
    queryset = Agreement.objects.all()
    permission_classes = [AdminPageOnly]
    http_method_names = ['get', 'post', 'delete', 'put']

    @extend_schema(summary="약관 목록 조회 (관리자)", tags=["약관"])
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = AgreementManagerSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="약관 상세 조회 (관리자)", tags=["약관"])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AgreementManagerSerializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="약관 생성", tags=["약관"])
    def create(self, request, *args, **kwargs):
        serializer = AgreementManagerSerializer(data=request.data)
        content = request.data.get('content', None)

        if content is None:
            return Response({'message': '약관 내용을 입력해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        agreement = serializer.save()
        AgreementVersion.objects.create(agreement=agreement, content=content, summary="신규 생성")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary="약관 삭제", tags=["약관"])
    def destroy(self, request, *args, **kwargs):
        agreement = self.get_object()
        agreement.deleted = True
        agreement.deleted_at = timezone.now()
        agreement.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="약관 수정", tags=["약관"])
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
