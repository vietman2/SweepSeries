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
    class Meta:
        model = Agreement
        fields = '__all__'
