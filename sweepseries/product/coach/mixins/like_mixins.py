from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response

from ..models import CoachLike
from ..serializers import CoachSimpleSerializer

class CoachLikeMixins:
    """
        코치 좋아요:
            - url: /v1/coaches/{coach_uuid}/like/
            - permission: 로그인한 사용자만 가능
        좋아요 한 코치 목록:
            - url: /v1/coaches/liked/
            - permission: 로그인한 사용자만 가능
    """

    @extend_schema(summary="좋아요 한 코치 조회", tags=["코치"])
    @action(detail=False, methods=['get'])
    def liked(self, request, pk=None):    # pylint: disable=unused-argument
        """
            좋아요 한 코치 목록 조회
        """
        user = request.user
        likes = user.liked_coaches.all()

        coaches = [like.coach for like in likes]
        serializer = CoachSimpleSerializer(coaches, many=True)
        serializer.context['request'] = request

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="코치 좋아요", tags=["코치"])
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):    # pylint: disable=unused-argument
        """
            코치 좋아요:
                - 이미 좋아요를 했다면 취소
                - 그렇지 않다면 좋아요
        """
        user = request.user
        coach = self.get_object()

        if CoachLike.objects.filter(user=user, coach=coach).exists():
            CoachLike.objects.filter(user=user, coach=coach).delete()
            return Response(
                status=status.HTTP_200_OK,
                data={"message": "좋아요 취소에 성공했습니다."}
            )

        CoachLike.objects.create(user=user, coach=coach)
        return Response(
            status=status.HTTP_200_OK,
            data={"message": "좋아요에 성공했습니다."}
        )
