from rest_framework import serializers

from .models import Diary

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'diary', 'date']

    def create(self, validated_data):
        user = self.context['request'].user

        existing_diary = Diary.objects.filter(user=user, date=validated_data['date']).first()

        if existing_diary:
            existing_diary.diary = validated_data['diary']
            existing_diary.save()
            return existing_diary

        diary = Diary.objects.create(user=user, **validated_data)
        return diary
