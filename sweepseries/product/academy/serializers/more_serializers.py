from django.core.files.storage import default_storage
from rest_framework import serializers

from auth.user.serializers import UserRelatedSerializer
from core.utils import get_presigned_url
from ..models import Academy, AcademyImage, AcademyFacility

class AcademyStatusSerializer(serializers.ModelSerializer):
    """
        아카데미 상태 확인용 Serializer
            - 관리자 페이지에서 등록 요청을 한 아카데미를 승인/거절 할 때 사용
    """
    owner           = UserRelatedSerializer(read_only=True)
    certification   = serializers.SerializerMethodField()
    verified_at     = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Academy
        fields = [
            "uuid", "name", "owner", "is_verified", "is_rejected", "certification", "verified_at",
            "reject_reason"
        ]

    def get_certification(self, obj):
        return get_presigned_url(obj.certificate)

class AcademyImageSerializer(serializers.ModelSerializer):
    id      = serializers.IntegerField(read_only=True)
    image   = serializers.FileField(write_only=True)
    uri     = serializers.SerializerMethodField()

    class Meta:
        model = AcademyImage
        fields = ["id", "image", "uri"]

    def get_uri(self, obj):
        return get_presigned_url(obj.image)

    def validate_image(self, value):
        ## 이미지 파일 형식 확인
        if not value.name.endswith(('.jpg', '.jpeg', '.png')):
            raise serializers.ValidationError("올바른 이미지 파일 형식이 아닙니다.")

        return value

    def create(self, validated_data):
        academy = self.context['academy']
        image = validated_data['image']
        filename = image.name.split('/')[-1]
        path = f"products/academies/{academy.uuid}/images/{filename}"
        default_storage.save(path, image)

        return AcademyImage.objects.create(academy=academy, image=path)

class ConvenienceSerializer(serializers.ModelSerializer):
    id          = serializers.IntegerField()
    name        = serializers.CharField(read_only=True)
    kor_name    = serializers.CharField(read_only=True)
    icon_url    = serializers.SerializerMethodField()
    type        = serializers.CharField(source="get_type_display", read_only=True)

    class Meta:
        model = AcademyFacility
        fields = ["id", "name", "kor_name", "icon_url", "type"]

    def get_icon_url(self, obj):
        return f"https://kr.object.ncloudstorage.com/sweepdev/facicons/{obj.name}.svg"
