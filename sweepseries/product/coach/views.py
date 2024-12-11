
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .models import Coach
from .serializers import CoachSimpleSerializer, CoachRegisterSerializer

class CoachViewSet(ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSimpleSerializer
    http_method_names = ['get', 'post']

    @extend_schema(summary="코치 등록", tags=["코치"])
    def create(self, request, *args, **kwargs):
        data = request.data
        data['profile_image'] = request.FILES.get('profile_image')
        serializer = CoachRegisterSerializer(data=data)
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
            data={"message": "코치 등록에 성공했습니다."}
        )
