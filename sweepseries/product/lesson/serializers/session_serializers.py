from django.utils import timezone
from rest_framework import serializers

from core.utils import get_duration_text, get_time_text
from ..models import Session

class SessionSerializer(serializers.ModelSerializer):
    id          = serializers.SerializerMethodField()
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    curriculum  = serializers.SerializerMethodField()
    color       = serializers.SerializerMethodField()
    time        = serializers.SerializerMethodField()
    type        = serializers.SerializerMethodField()
    done        = serializers.SerializerMethodField(read_only=True)
    date        = serializers.SerializerMethodField()
    full_date   = serializers.SerializerMethodField()
    academy_name= serializers.SerializerMethodField()

    class Meta:
        model = Session
        fields = [
            'id', 'type', 'title', 'description', 'color', 'curriculum',
            'time', 'done', 'date', 'full_date', 'academy_name'
        ]

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

    def get_curriculum(self, obj):
        return f"{obj.contract.curriculum.num_lessons}회권"

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

    def get_full_date(self, obj):
        tz = timezone.get_current_timezone()
        return obj.start_datetime.astimezone(tz).strftime('%Y년 %m월 %d일')

    def get_academy_name(self, obj):
        return obj.lesson.program.academy.name

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
