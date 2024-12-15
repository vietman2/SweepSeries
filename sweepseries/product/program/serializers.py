from django.db import models, transaction
from rest_framework import serializers

from .models import Program, Position, Target, Curriculum

class TargetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Target
        fields = ["id", "name"]

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ["id", "name"]

class CurriculumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curriculum
        fields = ["id", "num_lessons", "price"]

    def validate_num_lessons(self, value):
        if value < 1:
            raise serializers.ValidationError("수업 횟수는 1보다 작을 수 없습니다.")
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("가격은 0보다 작을 수 없습니다.")
        return value

class ProgramSerializer(serializers.ModelSerializer):
    target      = TargetSerializer(read_only=True)
    positions   = PositionSerializer(many=True, read_only=True)
    curriculums = CurriculumSerializer(many=True)

    class Meta:
        model = Program
        fields = ["id", "name", "duration", "target", "positions", "curriculums"]

    def validate_duration(self, value):
        if value % 30 != 0:
            raise serializers.ValidationError("수업 시간은 30분 단위로 입력해주세요.")

        return value

    def save(self, **kwargs):
        with transaction.atomic():
            academy = kwargs.pop("academy")
            curriculums = self.validated_data.pop("curriculums")
            target = kwargs.pop("target")
            positions = kwargs.pop("positions")
            program = Program.objects.create(academy=academy, target=target, **self.validated_data)

            program.positions.set(positions)
            for curriculum in curriculums:
                Curriculum.objects.create(program=program, **curriculum)

            return program
