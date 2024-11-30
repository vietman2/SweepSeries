from rest_framework import serializers

from .models import Agreement, AgreementVersion

class AgreementSimpleSerializer(serializers.ModelSerializer):
    has_content = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = ['id', 'title', 'required', 'has_content']

    def get_has_content(self, obj):
        version = AgreementVersion.objects.filter(agreement=obj).first()
        return bool(version.content)

class AgreementVersionSimpleSerializer(serializers.ModelSerializer):
    created_at  = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = AgreementVersion
        fields = ['id', 'created_at', 'summary']

class AgreementDetailSerializer(serializers.ModelSerializer):
    content     = serializers.SerializerMethodField(read_only=True)
    created_at  = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)
    updated_at  = serializers.SerializerMethodField(read_only=True)
    history     = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Agreement
        fields = '__all__'

    def get_content(self, obj):
        version = AgreementVersion.objects.filter(agreement=obj).first()
        return version.content if version else None

    def get_updated_at(self, obj):
        if obj.deleted:
            return obj.deleted_at.strftime('%Y-%m-%d')

        version = AgreementVersion.objects.filter(agreement=obj).first()

        return version.created_at.strftime('%Y-%m-%d')

    def get_history(self, obj):
        versions = AgreementVersion.objects.filter(agreement=obj).order_by('-created_at')
        data = AgreementVersionSimpleSerializer(versions, many=True).data

        if obj.deleted:
            data.append({
                'id': -1,
                'created_at': obj.deleted_at.strftime('%Y-%m-%d'),
                'summary': '약관 삭제'
            })

        return data

    def create(self, validated_data):
        agreement = Agreement.objects.create(**validated_data)

        return agreement

class AgreementUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AgreementVersion
        fields = ['content', 'summary']

    def create(self, validated_data):
        agreement = self.context['agreement']
        version = AgreementVersion.objects.create(agreement=agreement, **validated_data)

        return version
