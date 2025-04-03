from datetime import timedelta
from django.utils import timezone
from rest_framework import serializers

from core.utils import get_duration_text, get_time_text
from product.program.models import Program, Curriculum, CoachTeam
from ..models import SessionRequest

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
