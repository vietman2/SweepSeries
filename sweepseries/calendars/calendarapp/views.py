from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .models import Calendar, CalendarUser
from .serializers import CalendarSerializer

class CalendarViewSet(ModelViewSet):
    queryset = Calendar.objects.all()
    serializer_class = CalendarSerializer
    http_method_names = ['get']

    @extend_schema(summary="캘린더 목록 조회", tags=["캘린더"])
    def list(self, request, *args, **kwargs):
        ## only return the calendars that the user is the owner of, or a viewer/editor
        user = request.user
        q = Q()
        q |= Q(user=user)

        queryset = CalendarUser.objects.filter(q)

        serializer = CalendarSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
