from django.db.models import Q
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from .models import Academy
from .serializers import AcademySimpleSerializer, AcademyRegisterSerializer

class AcademyViewSet(ModelViewSet):
    queryset = Academy.objects.all()
    serializer_class = AcademySimpleSerializer
    http_method_names = ['get', 'post']

    def get_permissions(self):
        login_needed = ['create']
        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())

        return permissions

    @extend_schema(summary="아카데미 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        data = request.data
        data['certification'] = request.FILES.get('certification')
        data['main_logo'] = request.FILES.get('main_logo')
        serializer = AcademyRegisterSerializer(data=data)
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
            data={"message": "아카데미 등록에 성공했습니다."}
        )

    @extend_schema(summary="아카데미 리스트 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        query = request.query_params.get('query', None)
        uuid = request.user.uuid if request.user.is_authenticated else None

        q = Q()
        if query:
            q &= Q(name__icontains=query)

        self.queryset = self.queryset.filter(q)

        serializer = self.get_serializer(self.queryset, many=True)
        serializer.context['uuid'] = uuid
        return Response(serializer.data, status=status.HTTP_200_OK)
