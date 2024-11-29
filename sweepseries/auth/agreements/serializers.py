from rest_framework import serializers

from .models import Agreement

class AgreementSimpleSerializer(serializers.ModelSerializer):
    has_content = serializers.SerializerMethodField()

    class Meta:
        model = Agreement
        fields = ['id', 'title', 'required', 'has_content']

    def get_has_content(self, obj):
        return bool(obj.content)

class AgreementDetailSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = Agreement
        fields = '__all__'
