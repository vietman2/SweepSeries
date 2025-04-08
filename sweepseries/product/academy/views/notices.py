from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Academy, AcademyNotice
from ..permissions import IsObjectAcademyOwner
from ..serializers import AcademyNoticeSerializer

class AcademyNoticeViewSet(ModelViewSet):
    """
        아카데미 공지사항 API: url은 /v1/academies/{academy_id}/notices/
    """
    queryset = AcademyNotice.objects.all()
    serializer_class = AcademyNoticeSerializer
    http_method_names = ['get', 'post', 'delete', 'patch']

    def get_permissions(self):
        if self.request.method in ['DELETE', 'PATCH']:
            return [IsObjectAcademyOwner()]
        return [AllowAny()]

    @extend_schema(summary="공지사항 리스트 조회", tags=["아카데미"])
    def list(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])

        queryset = self.queryset.filter(academy=academy)
        serializer = AcademyNoticeSerializer(queryset, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="공지사항 상세 조회", tags=["아카데미"])
    def retrieve(self, request, *args, **kwargs):
        notice = self.get_object()

        serializer = AcademyNoticeSerializer(notice)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(summary="공지사항 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        data = request.data
        academy = Academy.objects.get(uuid=kwargs['academy_id'])

        user = request.user

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        serializer = AcademyNoticeSerializer(data=data)
        serializer.context['academy'] = academy

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
            data={"message": "공지사항 등록에 성공했습니다."}
        )

    @extend_schema(summary="공지사항 삭제", tags=["아카데미"])
    def destroy(self, request, *args, **kwargs):
        notice = self.get_object()

        notice.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @extend_schema(summary="공지사항 수정", tags=["아카데미"])
    def partial_update(self, request, *args, **kwargs):
        notice = self.get_object()

        data = request.data
        serializer = AcademyNoticeSerializer(notice, data=data, partial=True)

        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e.detail}
            )

        return Response(
            status=status.HTTP_200_OK,
            data=serializer.data
        )
