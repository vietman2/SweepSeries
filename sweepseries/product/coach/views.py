from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from auth.userprofile.models import UserProfile
from core.permissions import AdminOnly
from core.utils import is_admin_page
from product.academy.models import Academy
from product.validators import validate_instagram_url, normalize_instagram_url
from .enums import CoachApplicationStatus
from .models import Coach, CoachLike
from .permissions import IsSelf
from .serializers import CoachSimpleSerializer, CoachRegisterSerializer, CoachStatusSerializer

class CoachViewSet(ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSimpleSerializer
    http_method_names = ['get', 'post', 'patch']

    def get_permissions(self):
        login_needed = ['create', 'accept', 'deny', 'me']
        must_be_admin = ['approve', 'reject']
        must_be_self = ['introduction', 'sns']
        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_admin:
            permissions.append(AdminOnly())
        if self.action in must_be_self:
            permissions.append(IsSelf())

        return permissions

    @extend_schema(summary="코치 등록", tags=["코치"])
    def create(self, request, *args, **kwargs):
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

    def get_coaches_by_academy(self, request, academy_uuid):
        q = Q(academy__uuid=academy_uuid)

        q &= Q(is_verified=True, status=CoachApplicationStatus.APPROVED)
        self.queryset = self.queryset.filter(q)
        serializer = CoachSimpleSerializer(self.queryset, many=True)
        serializer.context['request'] = request

        return Response(serializer.data,status=status.HTTP_200_OK)

    def get_coaches_by_profile(self, request, profile_id):
        profile = UserProfile.objects.filter(id=profile_id).first()

        if profile is None:
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"error": "유저 정보가 없습니다."}
            )

        user = profile.user
        academy = Academy.objects.filter(owner=user).first()

        if academy is not None:
            q = Q(academy=academy)
            self.queryset = self.queryset.filter(q)
            serializer = CoachSimpleSerializer(self.queryset, many=True)
            serializer.context['request'] = request

            return Response(serializer.data, status=status.HTTP_200_OK)

        coach = Coach.objects.filter(person=user.person).first()

        if coach is not None:
            q = Q(academy=coach.academy)

            self.queryset = self.queryset.filter(q)
            serializer = CoachSimpleSerializer(self.queryset, many=True)
            serializer.context['request'] = request

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(
            status=status.HTTP_404_NOT_FOUND,
            data={"error": "코치 정보가 없습니다."}
        )

    @extend_schema(summary="코치 리스트 조회", tags=["코치"])
    def list(self, request, *args, **kwargs):
        user = request.user

        q = Q()

        if user.is_superuser and is_admin_page(request):
            status_query = request.query_params.get('status', None)
            if status_query == "승인 거부":
                q &= Q(is_rejected=True)
            elif status_query == "승인 완료":
                q &= Q(is_verified=True)
            elif status_query == "승인 대기":
                q &= Q(is_verified=False) & Q(is_rejected=False)
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "잘못된 status 값입니다."}
                )

            self.queryset = self.queryset.filter(q)
            serializer = CoachStatusSerializer(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        academy_uuid = request.query_params.get('academy', None)
        profile_id = request.query_params.get('profile', None)

        if academy_uuid is not None:
            return self.get_coaches_by_academy(request, academy_uuid)

        if profile_id is not None:
            return self.get_coaches_by_profile(request, profile_id)

        return Response(
            status=status.HTTP_400_BAD_REQUEST,
            data={"error": "아카데미 uuid를 입력해주세요."}
        )

    @extend_schema(summary="코치 상세 조회", tags=["코치"])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = CoachSimpleSerializer(instance)
        serializer.context['request'] = request

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def partial_update(self, request, *args, **kwargs):
        return Response(
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
            data={"error": "PATCH 메소드는 지원하지 않습니다."}
        )

    @extend_schema(summary="코치 승인", tags=["코치"])
    @action(detail=True, methods=['post'])
    def approve(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        coach = self.get_object()
        coach.is_verified = True
        coach.verified_at = timezone.now()
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 승인에 성공했습니다."}
        )

    @extend_schema(summary="코치 거부", tags=["코치"])
    @action(detail=True, methods=['post'])
    def reject(self, request, *args, **kwargs):     # pylint: disable=unused-argument
        coach = self.get_object()
        reject_reason = request.data.get('reject_reason', None)

        if reject_reason is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "거부 사유를 입력해주세요."}
            )

        coach.is_rejected = True
        coach.reject_reason = reject_reason
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 거부에 성공했습니다."}
        )

    @extend_schema(summary="코치 승인 (아카데미)", tags=["코치"])
    @action(detail=True, methods=['post'])
    def accept(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        coach = self.get_object()
        user = request.user
        academy = coach.academy

        if academy.owner != user:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        coach.status = CoachApplicationStatus.APPROVED
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 승인에 성공했습니다."}
        )

    @extend_schema(summary="코치 거부 (아카데미)", tags=["코치"])
    @action(detail=True, methods=['post'])
    def deny(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        coach = self.get_object()
        user = request.user
        academy = coach.academy

        if academy.owner != user:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        coach.status = CoachApplicationStatus.REJECTED
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "코치 거부에 성공했습니다."}
        )

    @extend_schema(summary="좋아요 한 코치 조회", tags=["코치"])
    @action(detail=False, methods=['get'])
    def liked(self, request, *args, **kwargs):    # pylint: disable=unused-argument
        user = request.user
        likes = user.liked_coaches.all()

        coaches = [like.coach for like in likes]
        serializer = CoachSimpleSerializer(coaches, many=True)
        serializer.context['request'] = request

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="코치 좋아요", tags=["코치"])
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):    # pylint: disable=unused-argument
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

    @extend_schema(summary="내 코치 정보 조회", tags=["코치"])
    @action(detail=False, methods=['get'])
    def me(self, request, *args, **kwargs):     # pylint: disable=unused-argument
        user = request.user
        coach = Coach.objects.filter(person__user=user)

        if not coach.exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"error": "코치 정보가 없습니다."}
            )

        coach = coach.first()
        serializer = CoachSimpleSerializer(coach)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="코치 소개글 수정", tags=["코치"])
    @action(detail=True, methods=['patch'])
    def introduction(self, request, pk=None):   # pylint: disable=unused-argument
        coach = self.get_object()

        introduction = request.data.get('introduction', None)
        if introduction is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "소개글을 입력해주세요."}
            )

        coach.introduction = introduction
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "소개글 수정에 성공했습니다."}
        )

    @extend_schema(summary="SNS 정보 수정", tags=["코치"])
    @action(detail=True, methods=['patch'])
    def sns(self, request, pk=None):    # pylint: disable=unused-argument
        coach = self.get_object()

        instagram = request.data.get('instagram', None)
        blog = request.data.get('blog', None)
        if instagram is None or blog is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "SNS 정보를 입력해주세요."}
            )

        try:
            validate_instagram_url(instagram)
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e.detail}
            )

        coach.instagram = normalize_instagram_url(instagram)
        coach.blog = blog
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "SNS 정보 수정에 성공했습니다."}
        )
