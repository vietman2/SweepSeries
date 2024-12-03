from rest_framework import serializers

from .models import FAQ

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        category_name = instance.get_category_display()
        data['category'] = category_name
        data['question'] = f'[{category_name}] {data["question"]}'
        return data
