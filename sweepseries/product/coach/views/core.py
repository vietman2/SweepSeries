from django.db.models import Q
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..enums import CoachApplicationStatus
from ..mixins import CoachLikeMixins, CoachProfileUpdateMixins, VerifyCoachMixins
from ..models import Coach
from ..permissions import IsSelf, IsCoachAcademyOwner
from ..serializers import CoachSimpleSerializer, CoachRegisterSerializer

class CoachViewSet(CoachLikeMixins, CoachProfileUpdateMixins, VerifyCoachMixins, ModelViewSet):
    """
        코치 API:
            - url: /v1/coaches/
            - actions:
                - create (등록): 로그인한 사용자만 가능
                - list (목록 조회) & retrieve(상세 조회): 누구나 가능
                - liked (좋아요 한 코치 목록): 로그인한 사용자만 가능
                - like (코치 좋아요): 로그인한 사용자만 가능
                - introduction (소개글 수정): 코치 본인만 가능
                - sns (SNS 정보 수정): 코치 본인만 가능
                - accept (코치 아카데미 등록 승인): 아카데미 소속 코치만 가능
                - reject (코치 아카데미 등록 거절): 아카데미 소속 코치만 가능
    """
    queryset = Coach.objects.filter(is_rejected=False)
    serializer_class = CoachSimpleSerializer
    http_method_names = ['get', 'post', 'patch']

    def get_permissions(self):
        authenticated_actions = ['create', 'like', 'liked']
        update_actions = ['introduction', 'sns']
        verify_actions = ['accept', 'reject']

        if self.action in authenticated_actions:
            return [IsAuthenticated()]
        if self.action in update_actions:
            return [IsSelf()]
        if self.action in verify_actions:
            return [IsCoachAcademyOwner()]

        return [AllowAny()]

    @extend_schema(summary="코치 등록", tags=["코치"])
    def create(self, request, *args, **kwargs):
        """
            코치 등록
        """
        data = request.data
        data['certificate'] = request.FILES.get('certificate')
        data['profile_image'] = request.FILES.get('profile_image')
        serializer = CoachRegisterSerializer(data=data)
        serializer.context['request'] = request

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e.detail}
            )

        return Response(
            status=status.HTTP_201_CREATED,
            data={"message": "코치 등록에 성공했습니다."}
        )

    @extend_schema(summary="코치 리스트 조회", tags=["코치"])
    def list(self, request, *args, **kwargs):
        """
            코치 목록 조회: 아카데미 uuid가 쿼리로 반드시 들어와야 함.
        """
        academy_uuid = request.query_params.get('academy', None)

        if academy_uuid is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "아카데미 uuid를 입력해주세요."}
            )

        q = Q(academy__uuid=academy_uuid)

        q &= Q(is_verified=True, status=CoachApplicationStatus.APPROVED)
        self.queryset = self.queryset.filter(q)
        serializer = CoachSimpleSerializer(self.queryset, many=True)
        serializer.context['request'] = request

        return Response(serializer.data,status=status.HTTP_200_OK)

    @extend_schema(summary="코치 상세 조회", tags=["코치"])
    def retrieve(self, request, *args, **kwargs):
        """
            코치 상세 조회
        """
        instance = self.get_object()
        serializer = CoachSimpleSerializer(instance)
        serializer.context['request'] = request

        return Response(serializer.data, status=status.HTTP_200_OK)
