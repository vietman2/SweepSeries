from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import PersonalSchedule
from .serializers import PersonalScheduleSerializer, AcademyScheduleSerializer

class ScheduleViewSet(ModelViewSet):
    queryset = PersonalSchedule.objects.all()
    serializer_class = PersonalScheduleSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post']

    @extend_schema(summary="일정 생성", tags=["일정"])
    def create(self, request, *args, **kwargs):
        schedule_type = request.data.pop('type', None)
        academy_uuid = request.data.pop('uuid', None)

        if schedule_type == "personal":
            serializer = PersonalScheduleSerializer(data=request.data)
        elif schedule_type == "academy":
            data = request.data.copy()
            data['uuid'] = academy_uuid
            serializer = AcademyScheduleSerializer(data=data)
        else:
            return Response({"detail": "Invalid schedule type"}, status=status.HTTP_400_BAD_REQUEST)

        serializer.context['request'] = request

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
