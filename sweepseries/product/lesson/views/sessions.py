from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from product.academy.models import Academy
from product.coach.models import Coach
from product.program.utils import get_available_times_from_session
from ..models import Session
from ..serializers import SessionDetailSerializer
from ..utils import get_my_sessions

class SessionViewSet(ModelViewSet):
    queryset = Session.objects.all()
    serializer_class = SessionDetailSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'patch']

    @extend_schema(summary="레슨 목록 조회", tags=["레슨"])
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
        except ValueError:
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        sessions = get_my_sessions(start_date, end_date, request.user.person)

        data = []

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
        ## 코치는 레슨 피드백을, 수강생은 레슨 평가를 수정할 수 있다.
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

    @extend_schema(summary="일일 레슨 조회", tags=["레슨"])
    @action(detail=False, methods=['get'])
    def daily(self, request):
        ## UUID와 날짜를 받아서 해당 날짜의 레슨을 조회한다.
        mode = request.query_params.get('mode', None)
        uuid = request.query_params.get('uuid', None)
        date = request.query_params.get('date', "")

        ## 날짜는 한국시간 날짜가 들어오고, DB에는 UTC로 저장되어 있으므로 변환해준다.
        try:
            tz = timezone.get_current_timezone()
            date = timezone.make_aware(datetime.strptime(date, "%Y-%m-%d"), tz)
        except ValueError:
            return Response(
                data={"message": "올바른 날짜 형식이 아닙니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if mode == 'coach':
            try:
                coach = Coach.objects.get(uuid=uuid)
            except ObjectDoesNotExist:
                return Response(
                    data={"message": "코치가 존재하지 않습니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            ## get all sessions that the coach is in
            q = Q(coaches=coach)
        else:
            try:
                academy = Academy.objects.get(uuid=uuid)
            except ObjectDoesNotExist:
                return Response(
                    data={"message": "아카데미가 존재하지 않습니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            ## get all sessions that the academy is in
            q = Q(lesson__program__academy=academy)

        q &= Q(start_datetime__date=date)
        sessions = Session.objects.filter(q)

        data = []

        for session in sessions:
            data.append(SessionDetailSerializer(session).data)

        return Response(data, status=status.HTTP_200_OK)

    @extend_schema(summary="레슨 변경 가능 시간 조회", tags=["레슨"])
    @action(detail=True, methods=['get'])
    def available_times(self, request, *args, **kwargs):    ## pylint: disable=unused-argument
        ## 레슨 변경 시, 변경 가능한 시간을 조회한다.
        session = self.get_object()
        date = request.query_params.get("date", None)

        if date is None:
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            date = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return Response(
                data={"message": "잘못된 요청입니다."},
                status=status.HTTP_400_BAD_REQUEST
            )

        times = get_available_times_from_session(session, date)

        return Response(data={"times": times}, status=status.HTTP_200_OK)
