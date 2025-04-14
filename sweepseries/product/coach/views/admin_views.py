from django.db.models import Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.permissions import AdminPageOnly
from core.utils import is_admin_page
from ..models import Coach
from ..serializers import CoachStatusSerializer

class CoachCatchBAdminView(ModelViewSet):
    """
        관리자 모드 API:
            - url: /staff/coaches/
            - permission: 캐치비 관리자만 가능
        코치 캐치비 등록 승인 / 거절:
            - url: /staff/coaches/{coach_uuid}/{accept|reject}/
            - permission: 캐치비 관리자만 가능
    """
    queryset = Coach.objects.all()
    serializer_class = CoachStatusSerializer
    permission_classes=[AdminPageOnly,]
    http_method_names = ['get', 'post']

    @extend_schema(exclude=True)
    def create(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="코치 목록 조회 (관리자 모드)", tags=["코치"])
    def list(self, request, *args, **kwargs):
        """
            코치 목록 조회 (관리자 모드)
        """

        status_query = request.query_params.get('status', None)

        if status_query == "승인 거부":
            q = Q(is_rejected=True)
        elif status_query == "승인 완료":
            q = Q(is_verified=True)
        elif status_query == "승인 대기":
            q = Q(is_verified=False) & Q(is_rejected=False)
        else:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "잘못된 status 값입니다."}
            )

        self.queryset = Coach.objects.filter(q)
        serializer = CoachStatusSerializer(self.queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="코치 캐치비 등록 승인", tags=["코치"])
    @action(detail=True, methods=['post'])
    def accept(self, request, *args, **kwargs):
        coach = self.get_object()

        coach.is_verified = True
        coach.verified_at = timezone.now()
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 승인에 성공했습니다."}
        )

    @extend_schema(summary="코치 캐치비 등록 거절", tags=["코치"])
    @action(detail=True, methods=['post'])
    def reject(self, request, *args, **kwargs):
        coach = self.get_object()

        reject_reason = request.data.get('reject_reason', None)

        if reject_reason is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "거절 사유를 입력해주세요."}
            )

        coach.is_rejected = True
        coach.reject_reason = reject_reason
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 거절에 성공했습니다."}
        )
