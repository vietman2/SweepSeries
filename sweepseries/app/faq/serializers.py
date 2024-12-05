from rest_framework import serializers

from .enums import FAQCategoryChoices
from .models import FAQ

class FAQSerializer(serializers.ModelSerializer):
    category = serializers.CharField(write_only=True)
    question = serializers.CharField(required=True)
    answer = serializers.CharField(required=True)

    class Meta:
        model = FAQ
        fields = ['id', 'category', 'question', 'answer', 'is_active']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        category_name = instance.get_category_display()
        data['category'] = category_name
        data['question'] = f'[{category_name}] {data["question"]}'

        if not instance.is_active:
            data['question'] = f"{data['question']} (삭제됨)"
        return data

    def validate_category(self, value):
        category_mapping = {
            "예약": FAQCategoryChoices.RESERVATIONS,
            "이벤트": FAQCategoryChoices.EVENTS,
            "아카데미": FAQCategoryChoices.ACADEMY,
            "레슨": FAQCategoryChoices.LESSONS,
            "프로모드": FAQCategoryChoices.PROMODE,
            "기타": FAQCategoryChoices.OTHERS
        }

        category_value = category_mapping.get(value)
        if category_value is None:
            raise serializers.ValidationError("Invalid category")

        return category_value

    def update(self, instance, validated_data):
        if 'question' not in validated_data:
            raise serializers.ValidationError("question is required")
        if 'answer' not in validated_data:
            raise serializers.ValidationError("answer is required")

        instance.question = validated_data.get('question')
        instance.answer = validated_data.get('answer')
        instance.save()
        return instance
