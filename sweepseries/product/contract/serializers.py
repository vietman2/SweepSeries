from rest_framework import serializers

from product.program.serializers import CurriculumSerializer
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    curriculum          = CurriculumSerializer(read_only=True)
    remaining_lessons   = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = ["id", "curriculum", "remaining_lessons"]

    def get_remaining_lessons(self, obj):
        return obj.curriculum.num_lessons - obj.scheduled_lessons
