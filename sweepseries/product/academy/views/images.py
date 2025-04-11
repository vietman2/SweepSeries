from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from ..models import Academy, AcademyImage
from ..permissions import IsObjectAcademyOwner
from ..serializers import AcademyImageSerializer

class AcademyImageViewSet(ModelViewSet):
    """
        아카데미 이미지 API: url은 /v1/academies/{academy_id}/images/
            - 아카데미 소개 이미지 업로드 및 삭제 (로고 아님)
    """
    queryset = AcademyImage.objects.all()
    serializer_class = AcademyImageSerializer
    http_method_names = ['post', 'delete']

    def get_permissions(self):
        if self.request.method in ['DELETE']:
            return [IsObjectAcademyOwner()]
        return [IsAuthenticated()]

    @extend_schema(summary="이미지 등록", tags=["아카데미"])
    def create(self, request, *args, **kwargs):
        academy = Academy.objects.get(uuid=kwargs['academy_id'])
        images = request.FILES.getlist('images')

        if len(images) == 0:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "이미지를 입력해주세요."}
            )

        user = request.user

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        serializer_data = [{"image": image} for image in images]
        serializer = AcademyImageSerializer(
            data=serializer_data, many=True, context={"academy": academy}
        )

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
            data=serializer.data
        )

    @extend_schema(summary="이미지 삭제", tags=["아카데미"])
    def destroy(self, request, *args, **kwargs):
        image = self.get_object()

        user = request.user
        academy = image.academy

        if user != academy.owner:
            return Response(
                status=status.HTTP_403_FORBIDDEN,
                data={"error": "권한이 없습니다."}
            )

        image.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
