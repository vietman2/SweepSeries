from botocore.exceptions import ClientError
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from product.validators import get_instagram_url
from ..utils import upload_profile_image

class CoachProfileUpdateMixins:
    """
        코치 프로필 수정:
            - url: /v1/coaches/{coach_uuid}/{action}/
            - permission: 코치 본인만 가능
    """
    @extend_schema(exclude=True)
    def partial_update(self, request, *args, **kwargs):
        return Response(
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
            data={"error": "PATCH 메소드는 지원하지 않습니다."}
        )

    @extend_schema(summary="코치 소개글 수정", tags=["코치"])
    @action(detail=True, methods=['patch'])
    def profile_image(self, request, pk=None):
        """
            코치 프로필 이미지 수정
        """
        coach = self.get_object()
        profile_image = request.FILES.get('profile_image', None)

        if profile_image is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "프로필 이미지를 입력해주세요."}
            )

        try:
            uploaded_image = upload_profile_image(coach.uuid, profile_image)
            coach.profile_image = uploaded_image
            coach.save()
        except ClientError:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "프로필 이미지 업로드에 실패했습니다."}
            )

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "프로필 이미지 수정에 성공했습니다."}
        )

    @extend_schema(summary="코치 소개글 수정", tags=["코치"])
    @action(detail=True, methods=['patch'])
    def introduction(self, request, pk=None):   # pylint: disable=unused-argument
        coach = self.get_object()

        introduction = request.data.get('introduction', None)
        if introduction is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "소개글을 입력해주세요."}
            )

        coach.introduction = introduction
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "소개글 수정에 성공했습니다."}
        )

    @extend_schema(summary="코치 SNS 정보 수정", tags=["코치"])
    @action(detail=True, methods=['patch'])
    def sns(self, request, pk=None):    # pylint: disable=unused-argument
        coach = self.get_object()

        instagram = request.data.get('instagram', None)
        blog = request.data.get('blog', None)
        if instagram is None or blog is None:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": "SNS 정보를 입력해주세요."}
            )

        try:
            coach.instagram = get_instagram_url(instagram)
        except ValidationError as e:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data={"error": e.detail}
            )

        coach.blog = blog
        coach.save()

        return Response(
            status=status.HTTP_200_OK,
            data={"message": "SNS 정보 수정에 성공했습니다."}
        )
