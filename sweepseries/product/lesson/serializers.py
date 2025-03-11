from datetime import timedelta
from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from core.utils import get_duration_text, get_time_text
from product.coach.models import Coach
from product.program.models import Program, Curriculum, CoachTeam
from .managers import (
    create_or_get_lesson, get_contract, get_or_create_new_student,
    add_student_to_academy, create_session
)
from .models import Lesson, Session, SessionRequest

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
            return "#14863E"

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

class SessionRequestSerializer(serializers.ModelSerializer):
    id              = serializers.IntegerField(read_only=True)
    time            = serializers.SerializerMethodField()
    title           = serializers.SerializerMethodField()
    description     = serializers.SerializerMethodField()
    details         = serializers.SerializerMethodField()
    color           = serializers.SerializerMethodField()
    date            = serializers.SerializerMethodField()
    program         = serializers.IntegerField(write_only=True)
    team            = serializers.IntegerField(write_only=True)
    start_datetime  = serializers.DateTimeField(write_only=True)
    curriculum      = serializers.IntegerField(write_only=True)

    class Meta:
        model = SessionRequest
        fields = [
            'id', 'time', 'title', 'description', 'color', 'date', 'details',
            'program', 'team', 'start_datetime', 'curriculum'
        ]

    def get_time(self, obj):
        start_time = get_time_text(obj.start_datetime)
        duration = obj.program.duration
        end_datetime = obj.start_datetime + timedelta(minutes=duration)
        end_time = get_time_text(end_datetime)

        return f'{start_time} ~ {end_time} ({get_duration_text(timedelta(minutes=duration))})'

    def get_title(self, obj):
        return obj.program.name
    
    def get_description(self, obj):
        ## return coaches names:
        coaches = ', '.join([coach.person.name for coach in obj.coaches.all()])

        return f'코치: {coaches}'

    def get_details(self, obj):
        ## TODO: 안심번호 개발하고, 예약자 연락처 추가!
        return f"예약자 성명: {obj.student.name}\n* 예약 승인/거절에 대한 책임 여부는 당사자에게 있음을 알립니다."

    def get_color(self, obj):   ## pylint: disable=unused-argument
        return '#14863E'

    def get_date(self, obj):
        dow = ['월', '화', '수', '목', '금', '토', '일']
        tz = timezone.get_current_timezone()
        day = obj.start_datetime.astimezone(tz).day
        dayofweek = obj.start_datetime.astimezone(tz).weekday()

        return f'{day}일. {dow[dayofweek]}'

    def validate_program(self, value):
        if value <= 0:
            raise serializers.ValidationError('프로그램을 선택해주세요.')

        return Program.objects.get(pk=value)

    def validate_team(self, value):
        if value <= 0:
            return None

        ## return coaches
        return CoachTeam.objects.get(pk=value).coaches.all()

    def validate_curriculum(self, value):
        if value <= 0:
            raise serializers.ValidationError('커리큘럼을 선택해주세요.')

        return Curriculum.objects.get(pk=value)

    def create(self, validated_data):
        program = validated_data.pop('program')
        coaches = validated_data.pop('team')
        start_datetime = validated_data.pop('start_datetime')
        curriculum = validated_data.pop('curriculum')

        session_request = SessionRequest.objects.create(
            program=program,
            student=self.context['user'].person,
            start_datetime=start_datetime,
            curriculum=curriculum
        )

        if coaches is not None:
            session_request.coaches.set(coaches)

        return session_request
