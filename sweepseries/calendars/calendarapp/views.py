import datetime
from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .enums import AuthChoices
from .models import Calendar, CalendarUser
from .serializers import CalendarSerializer

class CalendarViewSet(ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch', 'post', 'delete']

    @extend_schema(summary="캘린더 생성", tags=["캘린더"])
    def create(self, request, *args, **kwargs):
        user = request.user

        calendar = Calendar.objects.create(name="새 캘린더")
        calendar_user = CalendarUser.objects.create(
            user=user, calendar=calendar, auth=AuthChoices.OWNER, display_name="새 캘린더"
        )

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
        user = request.user

        calendar_user = CalendarUser.objects.get(user=user, calendar=instance)
        if calendar_user.auth == AuthChoices.OWNER:
            instance.delete()
        else:
            calendar_user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="캘린더 알림 설정", tags=["캘린더"])
    @action(detail=True, methods=['patch'])
    def notification(self, request, pk=None):
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
    def daily(self, request, pk=None):
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
            
            time = datetime.time(hour=int(hour_input), minute=int(minute_input))

            calendar_user.notifications_today = True
            calendar_user.daily_time = time
        calendar_user.save()

        serializer = CalendarSerializer(calendar_user)

        return Response(serializer.data, status=status.HTTP_200_OK)
