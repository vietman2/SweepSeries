from rest_framework import serializers

from .models import Inquiry

class InquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = [
            'id', 'title', 'description', 'reply', 'resolved',
            'replied', 'created_at', 'updated_at'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        return Inquiry.objects.create(user=user, **validated_data)
