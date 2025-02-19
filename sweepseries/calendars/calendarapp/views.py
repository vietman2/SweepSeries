from datetime import time as time_module
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .models import Calendar, CalendarUser
from .permissions import IsMember, IsOwner
from .serializers import CalendarSerializer
from .utils import create_new_calendar, get_monthly_data, get_daily_data

class CalendarViewSet(ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    http_method_names = ['get', 'patch', 'post', 'delete']

    def get_permissions(self):
        permissions = [IsAuthenticated()]

        if self.action in [
            'retrieve', 'partial_update', 'notification', 'daily', 'schedules', 'leave'
        ]:
            permissions.append(IsMember())
        elif self.action in ['destroy']:
            permissions.append(IsOwner())

        return permissions

    @extend_schema(summary="캘린더 생성", tags=["캘린더"])
    def create(self, request, *args, **kwargs):
        user = request.user

        calendar_user = create_new_calendar("새 캘린더", user)

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(summary="캘린더 목록 조회", tags=["캘린더"])
    def list(self, request, *args, **kwargs):
        ## only return the calendars that the user is the owner of, or a viewer/editor
        user = request.user
        q = Q()
        q |= Q(user=user)

        queryset = CalendarUser.objects.filter(q)

        serializer = CalendarSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="캘린더 상세 조회", tags=["캘린더"])
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="캘린더 수정", tags=["캘린더"])
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        name_input = request.data.get('name', None)
        color_input = request.data.get('color', None)

        if name_input is None and color_input is None:
            raise ValidationError("name 또는 color 중 하나는 필수입니다.")

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)

        if name_input is not None:
            calendar_user.display_name = name_input
        if color_input is not None:
            calendar_user.color = color_input

        calendar_user.save()

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="캘린더 삭제", tags=["캘린더"])
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="캘린더 연동 해제 (탈퇴)", tags=["캘린더"])
    @action(detail=True, methods=['delete'])
    def leave(self, request, pk=None):  # pylint: disable=unused-argument
        ## remove the user from the calendar
        instance = self.get_object()
        user = request.user

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)
        calendar_user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="캘린더 알림 설정", tags=["캘린더"])
    @action(detail=True, methods=['patch'])
    def notification(self, request, pk=None):   # pylint: disable=unused-argument
        ## toggle notification setting
        instance = self.get_object()
        user = request.user

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)

        if calendar_user.notifications:
            calendar_user.notifications = False
            calendar_user.notifications_today = False
            calendar_user.daily_time = None
        else:
            calendar_user.notifications = True
        calendar_user.save()

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="캘린더 오늘 알림 설정", tags=["캘린더"])
    @action(detail=True, methods=['patch'])
    def daily(self, request, pk=None):  # pylint: disable=unused-argument
        ## toggle daily notification setting
        instance = self.get_object()
        user = request.user
        time_input = request.data.get('time', None)

        if time_input is None:
            return Response({"detail": "time은 필수입니다."}, status=status.HTTP_400_BAD_REQUEST)

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)

        if calendar_user.notifications_today:
            calendar_user.notifications_today = False
            calendar_user.daily_time = None
        else:
            ## input given in ISO format
            ## convert to time format, and in the KR timezone
            hour_input = time_input.split(':')[0]
            minute_input = time_input.split(':')[1]

            time = time_module(hour=int(hour_input), minute=int(minute_input))

            calendar_user.notifications_today = True
            calendar_user.daily_time = time
        calendar_user.save()

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="월간 캘린더 조회", tags=["캘린더"])
    @action(detail=True, methods=['get'])
    def schedules(self, request, pk=None):  # pylint: disable=unused-argument
        ## return the events for the month
        calendar = self.get_object()
        month_query = request.query_params.get('month', None)
        daily_query = request.query_params.get('day', None)

        if month_query is None and daily_query is None:
            return Response({"detail": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)
        if month_query and daily_query:
            return Response({"detail": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

        if month_query:
            data = get_monthly_data(month_query, calendar, request.user)
            return Response(data, status=status.HTTP_200_OK)

        data = get_daily_data(daily_query, calendar, request.user)
        return Response(data, status=status.HTTP_200_OK)
