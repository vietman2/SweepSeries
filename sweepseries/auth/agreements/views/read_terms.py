from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Agreement
from ..serializers import (
    ReadAgreementSerializer, AgreementListSerializer, AgreementContentSerializer
)

class PrivacyPolicyView(GenericAPIView):
    """
        개인정보 처리 방침
    """
    permission_classes=[AllowAny,]
    http_method_names = ['get']

    @extend_schema(summary="개인정보 처리 방침", tags=["약관 조회"])
    def get(self, request):
        """
            약관 조회
        """
        version = request.query_params.get('version', None)

        policy = Agreement.objects.filter(title='Catch B 개인정보 처리방침', deleted=False).first()

        if not policy:
            return Response({'message': '약관이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReadAgreementSerializer(policy, context={'version': version})

        return Response(serializer.data, status=status.HTTP_200_OK)

class TermsOfServiceView(GenericAPIView):
    """
        서비스 이용 약관
    """
    permission_classes=[AllowAny,]
    http_method_names = ['get']

    @extend_schema(summary="서비스 이용 약관", tags=["약관 조회"])
    def get(self, request):
        """
            약관 조회
        """
        version = request.query_params.get('version', None)

        policy = Agreement.objects.filter(title='Catch B 서비스 이용약관', deleted=False).first()

        if not policy:
            return Response({'message': '약관이 존재하지 않습니다.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ReadAgreementSerializer(policy, context={'version': version})

        return Response(serializer.data, status=status.HTTP_200_OK)

class ReadAgreementsView(ModelViewSet):
    """
        약관 조회
    """
    queryset = Agreement.objects.all()
    serializer_class = AgreementListSerializer
    permission_classes=[AllowAny,]
    http_method_names = ['get']

    @extend_schema(summary="회원가입 약관", tags=["약관 조회"])
    def list(self, request, *args, **kwargs):
        """
            회원가입 약관 목록 조회
                - 추후, 필요할 시, 필드를 추가하여 따로 관리해야할 수 있음.
        """
        queryset = Agreement.objects.filter(deleted=False)
        serializer = AgreementListSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="회원가입 약관 상세 조회", tags=["약관 조회"])
    def retrieve(self, request, *args, **kwargs):
        """
            회원가입 약관 상세 조회
        """
        instance = self.get_object()
        serializer = AgreementContentSerializer(instance)

        return Response(serializer.data, status=status.HTTP_200_OK)
