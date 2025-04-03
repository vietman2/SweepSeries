from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import SessionRequest
from ..serializers import ScheduleChangeRequestSerializer

class SessionScheduleChangeViewSet(ModelViewSet):
    """
        레슨 예약 변경 요청을 관리하는 API.
        주소는 /v1/sessions/{세션ID}/schedule_change/.
    """
    queryset = SessionRequest.objects.all()
    serializer_class = ScheduleChangeRequestSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @extend_schema(summary="예약 변경 요청", tags=["레슨 예약 변경"])
    def create(self, request, *args, **kwargs):
        """
            요청된 날짜와 시간으로 예약을 변경을 요청한다.
        """
        session_id = kwargs.get('session_id')

        data = request.data.copy()
        data['session_id'] = session_id

        serializer = self.get_serializer(data=data)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data={"message": "예약 변경 요청이 성공적으로 등록되었습니다."},
            status=status.HTTP_201_CREATED
        )
