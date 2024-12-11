import json
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .enums import DayChoices
from .models import Academy, AcademyFacility, BusinessHours
from .permissions import IsAcademyOwner
from .serializers import (
    AcademySimpleSerializer, AcademyRegisterSerializer, AcademyStatusSerializer,
    AcademyDetailSerializer, ConvenienceSerializer
)
from .utils import update_daily_schedule

class AcademyViewSet(ModelViewSet):
    queryset = Academy.objects.all()
    serializer_class = AcademySimpleSerializer
    http_method_names = ['get', 'post', 'patch']

    def get_permissions(self):
        login_needed = ['create', 'my']
        must_be_admin = ['approve', 'reject']
        must_be_owner = ['introduction', 'facilities', 'hours']
        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_admin:
            permissions.append(AdminOnly())
        if self.action in must_be_owner:
            permissions.append(IsAcademyOwner())

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

            self.queryset = self.queryset.filter(q)
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

        uuids = academies.values_list('uuid', flat=True)
        return Response(
            status=status.HTTP_200_OK,
            data={"academies": uuids}
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
