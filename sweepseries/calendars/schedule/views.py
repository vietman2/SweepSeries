from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from product.contract.models import Contract
from product.contract.serializers import ContractSerializer
from .models import Schedule, Lesson, Session
from .serializers import (
    ScheduleSerializer, LessonSerializer, SessionDetailSerializer,
)

class ScheduleViewSet(ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @extend_schema(summary="일정 생성", tags=["일정"])
    def create(self, request, *args, **kwargs):
        serializer = ScheduleSerializer(data=request.data)
        serializer.context['request'] = request

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class LessonViewSet(ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'get']

    @extend_schema(summary="레슨 생성", tags=["레슨"])
    def create(self, request, *args, **kwargs):
        serializer = LessonSerializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨이 성공적으로 생성되었습니다."},
            status=status.HTTP_201_CREATED
        )

    @extend_schema(summary="레슨 검색", tags=["레슨"])
    def list(self, request, *args, **kwargs):
        ## query로 들어온 program과 student로 lesson이 있는지 검색.
        ## 있다면, Contract에 남아있는 레슨 횟수가 있는지도 확인하여 반환한다.
        program = request.query_params.get('program', None)
        student = request.query_params.get('student', None)

        try:
            Lesson.objects.get(program=program, student=student)
        except ObjectDoesNotExist:
            return Response(
                data={"remaining_lessons": -1},
                status=status.HTTP_200_OK
            )

        q = Q(customer=student)
        q &= Q(curriculum__program=program)

        contract = Contract.objects.filter(q).first()

        if contract is None:
            ## This should not happen.
            return Response(
                data={"message": "오류가 발생했습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            data=ContractSerializer(contract).data,
            status=status.HTTP_200_OK
        )

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

class SessionViewSet(ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionDetailSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    @extend_schema(exclude=True)
    def list(self, request, *args, **kwargs):
        month_query = request.query_params.get('month', None)

        if month_query is None or month_query == "":
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        month = month_query.split('-')[1]
        year = month_query.split('-')[0]

        try:
            month = int(month)
            year = int(year)
            start_date = datetime(year, month, 1)
            end_date = start_date + relativedelta(months=1)
        except ValueError as e:
            raise ValidationError("올바른 형식이 아닙니다.") from e

        tz = timezone.get_current_timezone()
        start_date = timezone.make_aware(start_date, tz)
        end_date = timezone.make_aware(end_date, tz)

        data = []

        q = Q(start_datetime__range=(start_date, end_date))
        q &= Q(lesson__student=request.user.person)

        sessions = Session.objects.filter(q)

        for session in sessions:
            data.append(SessionDetailSerializer(session).data)

        return Response(data, status=status.HTTP_200_OK)

    @extend_schema(summary="레슨 상세 조회", tags=["레슨"])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="레슨 수정", tags=["레슨"])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "레슨이 성공적으로 수정되었습니다."},
            status=status.HTTP_200_OK
        )
