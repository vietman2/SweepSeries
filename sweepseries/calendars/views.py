from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from auth.user.models import User
from product.academy.models import Academy
from .serializers import CalendarListSerializer
from .utils import (
    check_academy_calendar_permissions, get_personal_monthly_calendar_data,
    get_academy_monthly_calendar_data, get_personal_daily_calendar_data,
    get_academy_daily_calendar_data, toggle_academy_calendar_notifications,
    toggle_academy_calendar_daily_notifications, toggle_personal_daily_notifications
)

class PersonalCalendarViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = CalendarListSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    @extend_schema(summary="캘린더 목록 조회", tags=["캘린더"])
    def list(self, request, *args, **kwargs):
        ## 개인 캘린더, 수강생으로서 속한 캘린더, 코치로 속한 캘린더, 업주로 속한 캘린더 모두 리스트로 반환한다.
        user = request.user

        serializer = CalendarListSerializer(user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(exclude=True)
    def retrieve(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(exclude=True)
    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="월간 일정 조회", tags=["캘린더"])
    @action(detail=False, methods=['get'])
    def monthly(self, request, *args, **kwargs):    ## pylint: disable=unused-argument
        calendar_type = request.query_params.get('type', 'personal')
        uuid = request.query_params.get('uuid', None)
        month = request.query_params.get('month', None)
        user = request.user

        if month is None:
            return Response(data={"message": "월을 지정해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        if calendar_type == "personal":
            return get_personal_monthly_calendar_data(user, month, uuid)

        if calendar_type == "academy":
            return get_academy_monthly_calendar_data(uuid, user, month, uuid)

        return Response(data={"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="일간 일정 조회", tags=["캘린더"])
    @action(detail=False, methods=['get'])
    def daily(self, request, *args, **kwargs):      ## pylint: disable=unused-argument
        calendar_type = request.query_params.get('type', 'personal')
        uuid = request.query_params.get('uuid', None)
        date = request.query_params.get('date', None)
        user = request.user

        if date is None:
            return Response(data={"message": "날짜를 지정해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        if calendar_type == "personal":
            return get_personal_daily_calendar_data(user, date, uuid)

        if calendar_type == "academy":
            return get_academy_daily_calendar_data(uuid, user, date, uuid)

        return Response(data={"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="개인 캘린더 설정 변경", tags=["캘린더"])
    @action(detail=False, methods=['patch'])
    def info(self, request, *args, **kwargs):       ## pylint: disable=unused-argument
        user = request.user
        updated_title = request.data.get('title', None)
        updated_color = request.data.get('color', None)

        if updated_title:
            user.calendar_title = updated_title
        elif updated_color:
            user.calendar_color = updated_color
        else:
            return Response(
                data={"message": "변경할 설정을 지정해주세요."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.save()

        return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)

    @extend_schema(summary="캘린더 알림 설정 변경", tags=["캘린더"])
    @action(detail=False, methods=['patch'])
    def notifications(self, request, *args, **kwargs):  ## pylint: disable=unused-argument
        user = request.user
        calendar_type = request.data.pop('type', None)

        if calendar_type == "personal":
            ## toggle notifications
            user.notifications = not user.notifications

            user.save()

            return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)

        if calendar_type == "academy":
            uuid = request.data.get('uuid', None)
            role = check_academy_calendar_permissions(user, uuid)
            if role is None:
                return Response(status=status.HTTP_403_FORBIDDEN)

            toggle_academy_calendar_notifications(uuid, user, role)

            return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)

        return Response(data={"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="캘린더 매일 알림 설정 변경", tags=["캘린더"])
    @action(detail=False, methods=['patch'])
    def dailynoti(self, request, *args, **kwargs):      ## pylint: disable=unused-argument
        user = request.user
        calendar_type = request.data.pop('type', None)
        time = request.data.get('time', None)

        if calendar_type == "personal":
            if toggle_personal_daily_notifications(user, time):
                return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)
            return Response(data={"message": "시간을 지정해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        if calendar_type == "academy":
            uuid = request.data.get('uuid', None)
            role = check_academy_calendar_permissions(user, uuid)
            if role is None:
                return Response(status=status.HTTP_403_FORBIDDEN)

            try:
                toggle_academy_calendar_daily_notifications(uuid, user, role, time)
            except ValidationError as e:
                return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

            return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)

        return Response(data={"message": "잘못된 요청입니다."}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(summary="캘린더 공개 범위 변경", tags=["캘린더"])
    @action(detail=False, methods=['patch'])
    def scope(self, request, *args, **kwargs):      ## pylint: disable=unused-argument
        user = request.user
        uuid = request.data.get('uuid', None)
        scope = request.data.get('scope', None)

        if scope is None or scope not in [1, 2, 3]:
            return Response(data={"message": "변경할 범위를 지정해주세요."}, status=status.HTTP_400_BAD_REQUEST)

        if check_academy_calendar_permissions(user, uuid) != 'OWNER':
            return Response(status=status.HTTP_403_FORBIDDEN)

        academy = Academy.objects.get(uuid=uuid)

        academy.calendar_scope = scope
        academy.save()

        return Response(data={"message": "SUCCESS"}, status=status.HTTP_200_OK)
