from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class InitializerView(GenericAPIView):
    permission_classes=[AllowAny,]
    http_method_names = ['get', 'head', 'options']

    @extend_schema(summary="초기화", tags=["기본"])
    def get(self, request):
        return Response(data={
            "KAKAO_APP_KEY": settings.KAKAO_APP_KEY,
            "NAVER_CONSUMER_KEY": settings.NAVER_CONSUMER_KEY,
            "NAVER_CONSUMER_SECRET": settings.NAVER_CONSUMER_SECRET,
        }, status=status.HTTP_200_OK)
