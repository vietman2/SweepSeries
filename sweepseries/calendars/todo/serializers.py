from rest_framework import serializers

from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    completed   = serializers.BooleanField(read_only=True)

    class Meta:
        model = Todo
        fields = ['id', 'title', 'deadline', 'color', 'completed']

    def create(self, validated_data):
        user = self.context['request'].user

        return Todo.objects.create(user=user, **validated_data)
