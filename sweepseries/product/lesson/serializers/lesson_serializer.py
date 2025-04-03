from django.db.transaction import atomic
from rest_framework import serializers

from product.coach.models import Coach
from product.program.models import Program, Curriculum
from ..managers import (
    create_or_get_lesson, get_contract, get_or_create_new_student,
    add_student_to_academy, create_session
)
from ..models import Lesson

class LessonSerializer(serializers.ModelSerializer):
    program         = serializers.IntegerField(write_only=True)
    coaches         = serializers.ListField(child=serializers.CharField(), write_only=True)
    start_datetime  = serializers.DateTimeField(write_only=True)
    person          = serializers.JSONField(write_only=True)
    curriculum_id   = serializers.IntegerField(write_only=True)

    class Meta:
        model = Lesson
        fields = ['program', 'coaches', 'start_datetime', 'person', 'curriculum_id']

    def validate_curriculum_id(self, value):
        ## 양수가 아니면 안됨
        if value <= 0:
            raise serializers.ValidationError('커리큘럼을 선택해주세요.')

        return value

    def create(self, validated_data):
        program_id = validated_data.pop('program')
        coach_uuids = validated_data.pop('coaches')
        person_data = validated_data.pop('person')
        name = person_data.get('name', '')
        person_id = person_data.get('id', None)

        program = Program.objects.get(pk=program_id)
        coaches = [Coach.objects.get(uuid=uuid) for uuid in coach_uuids]

        with atomic():
            student = get_or_create_new_student(person_id, name, person_data['phone'])

            add_student_to_academy(student, program.academy)
            curriculum = Curriculum.objects.get(id=validated_data['curriculum_id'])
            contract = get_contract(student, curriculum)

            lesson = create_or_get_lesson(program, coaches, student)
            create_session(
                data={
                    'lesson': lesson, 'start_datetime': validated_data['start_datetime'],
                    'coaches': coaches, 'contract': contract, 'program': program
                }
            )

            return lesson
