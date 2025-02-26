from datetime import timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from auth.person.models import Person
from core.utils import get_duration_text, get_time_text
from product.academy.models import AcademyStudent
from product.coach.models import Coach
from product.contract.models import Contract
from product.program.models import Program, Curriculum
from .models import Lesson, Session

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

    def get_or_create_new_student(self, person_id, name, phone_number):
        if person_id is not None and person_id > 0:
            return Person.objects.get(id=person_id)

        try:
            person = Person.objects.get(phone_number=phone_number)
        except ObjectDoesNotExist:
            person = Person.objects.create(name=name, phone_number=phone_number)

        return person

    def get_or_create_contract(self, person, curriculum_id):
        ## Case 1. 계약이 없는 경우: 새로 생성
        ##  Case 1-1. DB에 없는 Person
        ##  Case 1-2. DB에 있지만, 아카데미에 새로 등록하는 Person
        ##  Case 1-3. 아카데미에 등록되어 있지만, 해당 프로그램/커리큘럼은 처음 수강하는 경우
        ## Case 2. 계약이 만료된 경우: 새로 생성
        ## Case 3. 잔여 레슨이 있는 계약이 있는 경우: 해당 계약 반환하고, num_scheduled_lessons + 1

        curriculum = Curriculum.objects.get(id=curriculum_id)

        contract = Contract.objects.filter(customer=person, curriculum=curriculum).first()

        if contract is None:
            ## Case 1.
            contract = Contract.objects.create(customer=person, curriculum=curriculum)

        ## 잔여 레슨이 있는지 확인
        if contract.curriculum.num_lessons > contract.scheduled_lessons:
            ## Case 3.
            contract.scheduled_lessons += 1
            contract.save()
        else:
            ## Case 2.
            contract = Contract.objects.create(
                customer=person,
                curriculum=curriculum,
                scheduled_lessons=1
            )

        return contract

    def create_lesson(self, program, coaches, student):
        if Lesson.objects.filter(program=program, student=student).exists():
            lesson = Lesson.objects.get(program=program, student=student)
        else:
            lesson = Lesson.objects.create(program=program, student=student)

        for coach in coaches:
            lesson.coaches.add(coach)
            lesson.save()

        return lesson

    def create_session(self, data):
        duration = data['program'].duration
        end_datetime = data['start_datetime'] + timedelta(minutes=duration)

        session = Session.objects.create(
            lesson=data['lesson'],
            start_datetime=data['start_datetime'],
            end_datetime=end_datetime,
            contract=data['contract']
        )
        session.coaches.set(data['coaches'])

        return session

    def add_student_to_academy(self, student, academy):
        ## add student to academy if not exists
        if not academy.students.filter(person__pk=student.pk).exists():
            AcademyStudent.objects.create(academy=academy, person=student)

    def create(self, validated_data):
        program_id = validated_data.pop('program')
        coach_uuids = validated_data.pop('coaches')
        person_data = validated_data.pop('person')
        name = person_data.get('name', '')
        person_id = person_data.get('id', None)

        program = Program.objects.get(pk=program_id)
        coaches = [Coach.objects.get(uuid=uuid) for uuid in coach_uuids]

        with atomic():
            student = self.get_or_create_new_student(person_id, name, person_data['phone'])

            self.add_student_to_academy(student, program.academy)
            contract = self.get_or_create_contract(student, validated_data['curriculum_id'])

            lesson = self.create_lesson(program, coaches, student)
            self.create_session(
                data={
                    'lesson': lesson, 'start_datetime': validated_data['start_datetime'],
                    'coaches': coaches, 'contract': contract, 'program': program
                }
            )

            return lesson

class SessionSerializer(serializers.ModelSerializer):
    id          = serializers.SerializerMethodField()
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    color       = serializers.SerializerMethodField()
    time        = serializers.SerializerMethodField()
    type        = serializers.SerializerMethodField()
    done        = serializers.SerializerMethodField(read_only=True)
    date        = serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = ['id', 'type', 'title', 'description', 'color', 'time', 'done', 'date']

    def get_id(self, obj):
        return f"s{obj.id}"

    def get_title(self, obj):
        return obj.lesson.program.name

    def get_description(self, obj):
        coaches = ', '.join([coach.person.name for coach in obj.coaches.all()])
        student = obj.lesson.student.name
        do_encoding = self.context.get('do_encoding', False)
        user = self.context.get('user', None)

        if user is None:
            return f'코치: {coaches}\t수강생: {student}'

        if do_encoding and user.person.name != student:
            return f'코치: {coaches}'

        return f'코치: {coaches}\t수강생: {student}'

    def get_color(self, obj):
        user = self.context.get('user', None)

        if user is None:
            return "#14863E80"

        if user.person.name == obj.lesson.student.name:
            return "#14863E"

        return "#14863E80"

    def get_type(self, obj):  ## pylint: disable=unused-argument
        return '레슨'

    def get_time(self, obj):
        start_time = get_time_text(obj.start_datetime)
        end_time = get_time_text(obj.end_datetime)

        duration = obj.end_datetime - obj.start_datetime
        duration_text = get_duration_text(duration)

        return f'{start_time} ~ {end_time} ({duration_text})'

    def get_done(self, obj):
        ## True if end_datetime is past
        ## timezone aware
        current_time = timezone.now()
        return obj.end_datetime < current_time

    def get_date(self, obj):
        ## return timezone aware {day}일. {dayofweek}
        dow = ['월', '화', '수', '목', '금', '토', '일']
        tz = timezone.get_current_timezone()
        day = obj.start_datetime.astimezone(tz).day
        dayofweek = obj.start_datetime.astimezone(tz).weekday()

        return f'{day}일. {dow[dayofweek]}'

class SessionDetailSerializer(SessionSerializer):
    coaches     = serializers.SerializerMethodField()
    student     = serializers.SerializerMethodField()
    #can_review  = serializers.SerializerMethodField()

    class Meta(SessionSerializer.Meta):
        fields = SessionSerializer.Meta.fields + [
            'notes', 'feedback', 'coaches', 'student'#, 'can_review'
        ]

    def get_date(self, obj):
        ## return timezone aware {day}일. {dayofweek}
        dow = ['월', '화', '수', '목', '금', '토', '일']
        tz = timezone.get_current_timezone()
        month = obj.start_datetime.astimezone(tz).month
        day = obj.start_datetime.astimezone(tz).day
        dayofweek = obj.start_datetime.astimezone(tz).weekday()

        return f'{month}월 {day}일. {dow[dayofweek]}'

    def get_coaches(self, obj):
        return [coach.person.id for coach in obj.lesson.coaches.all()]

    def get_student(self, obj):
        return obj.lesson.student.id

    def validate_feedback(self, value):
        if value == '':
            raise serializers.ValidationError('피드백을 입력해주세요.')

        return value

    def validate_notes(self, value):
        if value == '':
            raise serializers.ValidationError('노트를 입력해주세요.')

        return value
