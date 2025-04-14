from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..enums import CoachApplicationStatus

class VerifyCoachMixins:
    """
        코치 아카데미 등록 승인 / 거절:
            - url: /v1/coaches/{coach_uuid}/{accept|reject}/
            - permission: 캐치비 관리자만 가능
    """
    @extend_schema(summary="코치 아카데미 등록 승인", tags=["코치"])
    @action(detail=True, methods=['post'])
    def accept(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        coach = self.get_object()

        coach.status = CoachApplicationStatus.APPROVED
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 승인에 성공했습니다."}
        )

    @extend_schema(summary="코치 아카데미 등록 거절", tags=["코치"])
    @action(detail=True, methods=['post'])
    def reject(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        coach = self.get_object()

        coach.status = CoachApplicationStatus.REJECTED
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 거부에 성공했습니다."}
        )
