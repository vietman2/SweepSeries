from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from drf_spectacular.utils import extend_schema

from core.permissions import AdminOnly
from core.utils import is_admin_page
from .models import Academy
from .serializers import (
    AcademySimpleSerializer, AcademyRegisterSerializer, AcademyStatusSerializer
)
class AcademyViewSet(ModelViewSet):
    queryset = Academy.objects.all()
    serializer_class = AcademySimpleSerializer
    http_method_names = ['get', 'post']

    def get_permissions(self):
        login_needed = ['create']
        must_be_admin = ['approve', 'reject']
        permissions = []

        if self.action in login_needed:
            permissions.append(IsAuthenticated())
        if self.action in must_be_admin:
            permissions.append(AdminOnly())

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
        user = request.user

        q = Q()
        if query:
            q &= Q(name__icontains=query)

        if user.is_superuser and is_admin_page(request):
            status_query = request.query_params.get('status', None)
            if status_query == "승인 완료":
                q &= Q(is_verified=True)
            elif status_query == "승인 거부":
                q &= Q(is_rejected=True)
            elif status_query == "승인 대기":
                q &= Q(is_verified=False) & Q(is_rejected=False)
            else:
                return Response(
                    status=status.HTTP_400_BAD_REQUEST,
                    data={"error": "잘못된 status 값입니다."}
                )

            self.queryset = self.queryset.filter(q)
            serializer = AcademyStatusSerializer(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        q &= Q(is_verified=True)
        self.queryset = self.queryset.filter(q)
        serializer = AcademySimpleSerializer(self.queryset, many=True)
        serializer.context['request'] = request

        return Response(
            {"academies": serializer.data, "suggestions": serializer.data},
            status=status.HTTP_200_OK
        )

    @extend_schema(summary="아카데미 등록 승인", tags=["아카데미"])
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()

        academy.is_verified = True
        academy.verified_at = timezone.now()
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 승인이 완료되었습니다."}
        )

    @extend_schema(summary="아카데미 등록 거부", tags=["아카데미"])
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None): # pylint: disable=unused-argument
        academy = self.get_object()
        reject_reason = request.data.get('reject_reason', None)

        if reject_reason is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "거부 사유를 입력해주세요."}
            )

        academy.is_rejected = True
        academy.reject_reason = reject_reason
        academy.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "아카데미 거부가 완료되었습니다."}
        )
