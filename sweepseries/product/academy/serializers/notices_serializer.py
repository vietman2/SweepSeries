from django.core.files.storage import default_storage
from django.db import transaction
from rest_framework import serializers

from core.utils import get_presigned_url
from ..enums import NoticeTypeChoices
from ..models import AcademyNotice, AcademyNoticeAttachment

class AcademyNoticeSerializer(serializers.ModelSerializer):
    """
        아카데미 공지사항 Serializer
    """
    id          = serializers.IntegerField(read_only=True)
    type        = serializers.CharField(write_only=True)
    title       = serializers.CharField()
    content     = serializers.CharField()
    updated_at  = serializers.DateTimeField(format="%Y.%m.%d", read_only=True)
    image       = serializers.FileField(required=False)

    class Meta:
        model = AcademyNotice
        fields = ["id", "title", "content", "updated_at", "image", "type"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['title'] = f"[{instance.get_type_display()}] {data['title']}"
        if instance.attachments.exists():
            data['image'] = get_presigned_url(instance.attachments.first().file)
        return data

    def validate_type(self, value):
        if value == "공지":
            return NoticeTypeChoices.NOTICE
        if value == "이벤트":
            return NoticeTypeChoices.EVENT
        if value == "기타":
            return NoticeTypeChoices.OTHERS

        raise serializers.ValidationError("올바른 공지 타입을 입력해주세요.")

    def upload_image(self):
        file = self.validated_data['image']
        filename = file.name.split('/')[-1]
        academy = self.context['academy']
        path = f"products/academies/{academy.uuid}/notices/{filename}"
        default_storage.save(path, file)
        return path

    def update(self, instance, validated_data):
        ## only update title and content
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()

        return instance

    def create(self, validated_data):
        academy = self.context['academy']

        with transaction.atomic():
            image = validated_data.pop('image', None)
            notice = AcademyNotice.objects.create(academy=academy, **validated_data)

            if image:
                image = self.upload_image()
                AcademyNoticeAttachment.objects.create(notice=notice, file=image)

            return notice
