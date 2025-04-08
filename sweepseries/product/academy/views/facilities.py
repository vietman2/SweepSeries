from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import AcademyFacility
from ..permissions import IsAcademyOwner
from ..serializers import ConvenienceSerializer

class FacilityViewSet(ModelViewSet):
    """
        시설 API: url은 /v1/academies/facilities/
            - 프로모드에서 프로필 수정 시, 시설 목록을 조회할 때 사용
    """
    queryset = AcademyFacility.objects.all()
    serializer_class = ConvenienceSerializer
    http_method_names = ['get']

    def get_permissions(self):
        return [IsAcademyOwner()]

    @extend_schema(summary="시설 목록 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        queryset = self.queryset
        serializer = ConvenienceSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
