from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from calendars.calendarapp.enums import AuthChoices
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['post', 'patch']

    @extend_schema(summary="할 일 생성", tags=["할 일"])
    def create(self, request, *args, **kwargs):
        serializer = TodoSerializer(data=request.data)
        serializer.context['request'] = request

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(exclude=True)
    def partial_update(self, request, *args, **kwargs):
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

    @extend_schema(summary="할 일 토글", tags=["할 일"])
    @action(detail=True, methods=['patch'])
    def toggle(self, request, pk=None):
        todo = self.get_object()

        allowed_auth = [AuthChoices.OWNER, AuthChoices.EDITOR]
        user = request.user
        calendar = todo.calendar

        if not calendar.calendar_users.filter(user=user, auth__in=allowed_auth).exists():
            return Response({"detail": "권한이 없습니다."}, status=status.HTTP_403_FORBIDDEN)

        todo.completed = not todo.completed
        todo.save()

        serializer = TodoSerializer(todo)

        return Response(serializer.data, status=status.HTTP_200_OK)
