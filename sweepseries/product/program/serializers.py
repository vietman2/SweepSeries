from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from rest_framework import serializers

from product.academy.models import Academy
from product.coach.models import Coach
from product.coach.serializers import CoachSimpleSerializer
from .models import Program, Position, Target, Curriculum, CoachTeam
from .utils import create_curriculum

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

class CoachTeamSerializer(serializers.ModelSerializer):
    id      = serializers.UUIDField(read_only=True)
    coaches = serializers.SerializerMethodField()
    uuids   = serializers.ListField(child=serializers.UUIDField(), write_only=True)

    class Meta:
        model = CoachTeam
        fields = ["id", "coaches", "uuids"]

    def get_coaches(self, obj):
        coaches = obj.coaches.all()

        return CoachSimpleSerializer(coaches, many=True).data

    def create(self, validated_data):
        program = self.context["program"]
        uuids = validated_data.pop("uuids")
        coach_team = CoachTeam.objects.create()

        for uuid in uuids:
            coach = program.academy.coaches.get(uuid=uuid)
            coach_team.coaches.add(coach)

        program.teams.add(coach_team)

        return coach_team

class ProgramSerializer(serializers.ModelSerializer):
    target              = TargetSerializer(read_only=True)
    positions           = PositionSerializer(many=True, read_only=True)
    curriculums         = serializers.SerializerMethodField()
    lowest_price        = serializers.SerializerMethodField()
    academy_uuid        = serializers.SerializerMethodField()
    random_assignment   = serializers.SerializerMethodField()
    teams               = serializers.SerializerMethodField()
    academy             = serializers.UUIDField(write_only=True)
    target_id           = serializers.IntegerField(write_only=True)
    positions_id        = serializers.ListField(child=serializers.IntegerField(), write_only=True)
    curriculum_data     = serializers.ListField(write_only=True)
    coach_team          = serializers.JSONField(write_only=True)

    class Meta:
        model = Program
        fields = [
            "id", "name", "duration", "target", "positions",
            "curriculums", "lowest_price", "academy_uuid",
            "random_assignment", "teams",
            "academy", "target_id", "positions_id",
            "curriculum_data", "coach_team"
        ]

    def get_lowest_price(self, obj):
        return obj.curriculums.order_by("price").first().price

    def get_academy_uuid(self, obj):
        return obj.academy.uuid

    def get_curriculums(self, obj):
        curriculums = obj.curriculums.filter(is_deleted=False)

        return CurriculumSerializer(curriculums, many=True).data

    def get_random_assignment(self, obj):
        return obj.select_disabled

    def get_teams(self, obj):
        if obj.select_disabled:
            return []

        return CoachTeamSerializer(obj.teams.all(), many=True).data

    def validate_duration(self, value):
        if value % 30 != 0:
            raise serializers.ValidationError("수업 시간은 30분 단위로 입력해주세요.")

        return value

    def validate_academy(self, value):
        try:
            academy = Academy.objects.get(uuid=value)
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError("존재하지 않는 아카데미입니다.") from e

        return academy

    def set_team(self, program, coach_team):
        if coach_team['select_disabled']:
            program.select_disabled = True
            program.save()

            return program

        teams = coach_team['teams']

        if not teams:
            raise serializers.ValidationError("팀을 선택해주세요.")

        for team in teams:
            coaches = team['coaches']
            new_team = CoachTeam.objects.create()
            for coach in coaches:
                coach_obj = Coach.objects.get(uuid=coach['uuid'])
                new_team.coaches.add(coach_obj)

            program.teams.add(new_team)

        program.select_disabled = False
        program.save()

        return program

    def update(self, instance, validated_data):
        target_id = validated_data.get("target_id", instance.target_id)
        positions_id = validated_data.get("positions_id")

        name = validated_data.get("name", instance.name)
        duration = validated_data.get("duration", instance.duration)
        target = Target.objects.get(id=target_id)
        positions = Position.objects.filter(id__in=positions_id)

        instance.name = name
        instance.duration = duration
        instance.target = target
        instance.positions.set(positions)

        instance.save()

        return instance

    def create(self, validated_data):
        with transaction.atomic():
            curriculums = validated_data.pop("curriculum_data")
            target_id = validated_data.pop("target_id")
            positions_id = validated_data.pop("positions_id")
            target = Target.objects.get(id=target_id)
            validated_data["target"] = target
            coach_team_data = validated_data.pop("coach_team")

            program = Program.objects.create(**validated_data)

            positions = Position.objects.filter(id__in=positions_id)

            program.positions.set(positions)
            for curriculum in curriculums:
                num_lessons = curriculum["num_lessons"]
                price = curriculum["price"]
                program = create_curriculum(program, num_lessons, price)

            program = self.set_team(program, coach_team_data)

            return program
