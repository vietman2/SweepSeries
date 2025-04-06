from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from ..models import Agreement, AgreementVersion

class VersionsSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = AgreementVersion
        fields = ['id', 'created_at']

class ReadAgreementSerializer(serializers.ModelSerializer):
    """
        약관 조회 Serializer
    """
    content     = serializers.SerializerMethodField()
    versions    = VersionsSerializer(many=True, read_only=True)

    class Meta:
        model = Agreement
        fields = ['id', 'title', 'content', 'versions']

    def get_content(self, obj):
        """
            약관 내용 조회
                - 약관 버전이 존재하는 경우 해당 버전의 내용을 반환
        """
        version_query = self.context.get('version', None)

        if version_query:
            try:
                version = AgreementVersion.objects.get(agreement=obj, id=version_query)

                return version.content
            except ObjectDoesNotExist:
                return "약관 버전이 존재하지 않습니다."

        version = AgreementVersion.objects.filter(agreement=obj).order_by('-created_at').first()

        if not version:
            return "약관 버전이 존재하지 않습니다."

        return version.content

class AgreementListSerializer(serializers.ModelSerializer):
    has_content = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = ['id', 'title', 'required', 'has_content']

    def get_has_content(self, obj):
        version = AgreementVersion.objects.filter(agreement=obj).first()
        return bool(version.content)

class AgreementContentSerializer(serializers.ModelSerializer):
    content         = serializers.SerializerMethodField()
    last_updated    = serializers.SerializerMethodField()
    class Meta:
        model = Agreement
        fields = ['title', 'content', 'last_updated']

    def get_content(self, obj):
        version = AgreementVersion.objects.filter(agreement=obj).first()
        return version.content if version else ""

    def get_last_updated(self, obj):
        version = AgreementVersion.objects.filter(agreement=obj).first()
        return version.created_at.strftime('%Y-%m-%d') if version else ""
