import json
from botocore.exceptions import ClientError
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from core.utils import is_admin_page
from product.coach.enums import CoachApplicationStatus
from product.coach.serializers import CoachSimpleSerializer
from product.lesson.models import SessionRequest
from product.lesson.serializers import SessionRequestSerializer
from .enums import DayChoices
from .models import (
    Academy, AcademyFacility, AcademyNotice, BusinessHours, AcademyImage, AcademyLike
)
from .permissions import IsAcademyOwner, IsAcademyStaff
from .serializers import (
    AcademySimpleSerializer, AcademyRegisterSerializer, AcademyStatusSerializer,
    AcademyDetailSerializer, AcademyNoticeSerializer, ConvenienceSerializer,
    AcademyImageSerializer
)
from .utils import update_daily_schedule, upload_logo

class AcademyViewSet(ModelViewSet):
    queryset = Academy.objects.filter(is_rejected=False)
    serializer_class = AcademySimpleSerializer
    http_method_names = ['get', 'post', 'patch']

    def get_permissions(self):
        login_needed = ['create', 'my']
        must_be_admin = ['approve', 'reject']   ## 캐치비 관리자
        must_be_owner = ['introduction', 'facilities', 'hours', 'employees']
        must_be_academy_staff = ['logo']
        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_admin:
            permissions.append(AdminOnly())
        if self.action in must_be_owner:
            permissions.append(IsAcademyOwner())
        if self.action in must_be_academy_staff:
            permissions.append(IsAcademyStaff())

        return permissions

    @extend_schema(summary="아카데미 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        data = request.data
        data['certification'] = request.FILES.get('certification')
        data['main_logo'] = request.FILES.get('main_logo')
        serializer = AcademyRegisterSerializer(data=data)
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
            data={"message": "아카데미 등록에 성공했습니다."}
        )

    @extend_schema(summary="아카데미 리스트 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        query = request.query_params.get('query', None)
        user = request.user

        q = Q()
        if query:
            q &= Q(name__icontains=query)

        if user.is_superuser and is_admin_page(request):
            status_query = request.query_params.get('status', None)
            if status_query == "승인 완료":
                q &= Q(is_verified=True)
            elif status_query == "승인 거부":
                q &= Q(is_rejected=True)
            elif status_query == "승인 대기":
                q &= Q(is_verified=False) & Q(is_rejected=False)
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "잘못된 status 값입니다."}
                )

            self.queryset = Academy.objects.filter(q)
            serializer = AcademyStatusSerializer(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        q &= Q(is_verified=True)
        self.queryset = self.queryset.filter(q)
        serializer = AcademySimpleSerializer(self.queryset, many=True)
        serializer.context['request'] = request

        return Response(
            {"academies": serializer.data, "suggestions": serializer.data},
            status=status.HTTP_200_OK
        )

    @extend_schema(summary="아카데미 상세 조회", tags=["아카데미"])
    def retrieve(self, request, *args, **kwargs):
        academy = self.get_object()
        serializer = AcademyDetailSerializer(academy)
        serializer.context['request'] = request
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="내 아카데미 조회", tags=["아카데미"])
    @action(detail=False, methods=['get'])
    def my(self, request):
        user = request.user
        academies = Academy.objects.filter(owner=user)

        if not academies.exists():
            return Response(
                status=status.HTTP_404_NOT_FOUND,
                data={"error": "아카데미 정보가 없습니다."}
            )

        academies = AcademySimpleSerializer(academies, many=True)
        return Response(
            status=status.HTTP_200_OK,
            data=academies.data
        )

    @extend_schema(summary="좋아요 한 아카데미 조회", tags=["아카데미"])
    @action(detail=False, methods=['get'])
    def liked(self, request):
        user = request.user
        ## likes = AcademyLike object
        likes = user.liked_academies.all()

        ## get academy object from likes
        academies = [like.academy for like in likes]
        serializer = AcademySimpleSerializer(academies, many=True)
        serializer.context['request'] = request

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

    @extend_schema(summary="좋아요", tags=["아카데미"])
    @action(detail=True, methods=['post'])
    def like(self, request, pk=None): # pylint: disable=unused-argument
        user = request.user
        academy = self.get_object()

        if AcademyLike.objects.filter(user=user, academy=academy).exists():
            ## remove like = unlike
            AcademyLike.objects.filter(user=user, academy=academy).delete()
            return Response(
                status=status.HTTP_200_OK,
                data={"message": "좋아요 취소되었습니다."}
            )

        AcademyLike.objects.create(user=user, academy=academy)
        return Response(
            status=status.HTTP_200_OK,
            data={"message": "좋아요 완료되었습니다."}
        )

    @extend_schema(summary="아카데미 등록 승인", tags=["아카데미"])
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()

        academy.is_verified = True
        academy.verified_at = timezone.now()
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 승인이 완료되었습니다."}
        )

    @extend_schema(summary="아카데미 등록 거부", tags=["아카데미"])
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        reject_reason = request.data.get('reject_reason', None)

        if reject_reason is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "거부 사유를 입력해주세요."}
            )

        academy.is_rejected = True
        academy.reject_reason = reject_reason
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 거부가 완료되었습니다."}
        )

    @extend_schema(summary="아카데미 소개 수정", tags=["아카데미"])
    @action(detail=True, methods=['patch'])
    def introduction(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        introduction = request.data.get('introduction', None)

        if introduction is None or introduction == "":
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "소개 내용을 입력해주세요."}
            )

        academy.introduction = introduction
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 소개가 수정되었습니다."}
        )

    @extend_schema(summary="아카데미 시설 업데이트", tags=["아카데미"])
    @action(detail=True, methods=['patch'])
    def facilities(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        facilities = request.data.get('facilities', None)

        if facilities is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "시설 정보를 입력해주세요."}
            )

        academy.convenience.clear()
        for facility in facilities:
            facility = AcademyFacility.objects.get(id=facility)
            academy.convenience.add(facility)
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 시설이 업데이트되었습니다."}
        )

    @extend_schema(summary="아카데미 운영시간 업데이트", tags=["아카데미"])
    @action(detail=True, methods=['patch'])
    def hours(self, request, pk=None):  # pylint: disable=unused-argument
        academy = self.get_object()
        hours = request.data.get('data', None)

        if hours is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "운영시간 정보를 입력해주세요."}
            )

        ## decode json
        hours = json.loads(hours)

        monday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.MONDAY)
        tuesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.TUESDAY)
        wednesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.WEDNESDAY)
        thursday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.THURSDAY)
        friday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.FRIDAY)
        saturday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SATURDAY)
        sunday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SUNDAY)

        try:
            update_daily_schedule(monday, hours["monday"])
            update_daily_schedule(tuesday, hours["tuesday"])
            update_daily_schedule(wednesday, hours["wednesday"])
            update_daily_schedule(thursday, hours["thursday"])
            update_daily_schedule(friday, hours["friday"])
            update_daily_schedule(saturday, hours["saturday"])
            update_daily_schedule(sunday, hours["sunday"])
        except DjangoValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e}
            )

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 운영시간이 업데이트되었습니다."}
        )

    @extend_schema(summary="아카데미 코치 목록 조회 (직원관리)", tags=["아카데미"])
    @action(detail=True, methods=['get'])
    def employees(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        print(academy.uuid)
        accepted_coaches = academy.coaches.filter(status=CoachApplicationStatus.APPROVED)
        pending_coaches = academy.coaches.filter(status=CoachApplicationStatus.PENDING)

        accepted_serializer = CoachSimpleSerializer(accepted_coaches, many=True)
        pending_serializer = CoachSimpleSerializer(pending_coaches, many=True)

        return Response(
            status=status.HTTP_200_OK,
            data={
                "accepted": accepted_serializer.data,
                "pending": pending_serializer.data
            }
        )

    @extend_schema(summary="아카데미 로고 변경", tags=["아카데미"])
    @action(detail=True, methods=['patch'])
    def logo(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        logo = request.FILES.get('main_logo', None)

        if logo is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "로고를 입력해주세요."}
            )

        try:
            uploaded_logo = upload_logo(academy.uuid, logo)
            academy.logo = uploaded_logo
            academy.save()
        except ClientError:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "로고 업로드에 실패했습니다."}
            )

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "로고가 변경되었습니다."}
        )

class FacilityViewSet(ModelViewSet):
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

class AcademyNoticeViewSet(ModelViewSet):
    queryset = AcademyNotice.objects.all()
    serializer_class = AcademyNoticeSerializer
    permission_classes = [AllowAny]
    http_method_names = ['get', 'post', 'delete', 'patch']

    @extend_schema(summary="공지사항 리스트 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])

        queryset = self.queryset.filter(academy=academy)
        serializer = AcademyNoticeSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="공지사항 상세 조회", tags=["아카데미"])
    def retrieve(self, request, *args, **kwargs):
        notice = self.get_object()

        serializer = AcademyNoticeSerializer(notice)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="공지사항 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        data = request.data
        academy = Academy.objects.get(uuid=kwargs['academy_id'])

        user = request.user

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        serializer = AcademyNoticeSerializer(data=data)
        serializer.context['academy'] = academy

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
            data={"message": "공지사항 등록에 성공했습니다."}
        )

    @extend_schema(summary="공지사항 삭제", tags=["아카데미"])
    def destroy(self, request, *args, **kwargs):
        notice = self.get_object()

        user = request.user
        academy = notice.academy

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        notice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="공지사항 수정", tags=["아카데미"])
    def partial_update(self, request, *args, **kwargs):
        notice = self.get_object()
        academy = notice.academy

        user = request.user

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        data = request.data
        serializer = AcademyNoticeSerializer(notice, data=data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e.detail}
            )

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )

class AcademyImageViewSet(ModelViewSet):
    queryset = AcademyImage.objects.all()
    serializer_class = AcademyNoticeSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'delete']

    @extend_schema(summary="이미지 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])
        images = request.FILES.getlist('images')

        if len(images) == 0:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "이미지를 입력해주세요."}
            )

        user = request.user

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        serializer_data = [{"image": image} for image in images]
        serializer = AcademyImageSerializer(
            data=serializer_data, many=True, context={"academy": academy}
        )

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
            data=serializer.data
        )

    @extend_schema(summary="이미지 삭제", tags=["아카데미"])
    def destroy(self, request, *args, **kwargs):
        image = self.get_object()

        user = request.user
        academy = image.academy

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
