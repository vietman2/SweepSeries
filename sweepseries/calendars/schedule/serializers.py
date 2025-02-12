from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from auth.person.models import Person
from calendars.calendarapp.enums import AuthChoices
from calendars.calendarapp.models import Calendar
from product.coach.models import Coach
from product.program.models import Program
from .models import Schedule, Event, Lesson, Session
from .utils import get_time_text, get_duration_text

class ScheduleSerializer(serializers.ModelSerializer):
    calendar_id     = serializers.IntegerField(write_only=True)
    start_datetime  = serializers.DateTimeField(write_only=True)
    end_datetime    = serializers.DateTimeField(write_only=True)
    is_allday       = serializers.BooleanField(write_only=True)
    alarm           = serializers.JSONField(write_only=True)
    repeat          = serializers.JSONField(write_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id', 'calendar_id', 'title', 'description', 'color', 'is_allday', 
            'start_datetime', 'end_datetime', 'alarm', 'repeat'
        ]

    def validate(self, attrs):
        ## 일정 시작 시간이 종료 시간보다 빠른지 확인
        if attrs['start_datetime'] >= attrs['end_datetime']:
            raise serializers.ValidationError('일정 시작 시간이 종료 시간보다 빠릅니다.')

        return attrs

    def get_alarm_time(self, start_datetime, delta, unit):
        units = {0: 'minutes', 1: 'hours', 2: 'days', 3: 'weeks'}

        if unit not in units:
            raise serializers.ValidationError('알람 시간 단위가 올바르지 않습니다.')

        return start_datetime - timedelta(**{units[unit]: delta})

    def get_time(self, time, period, index):
        if period == 0: ## 매일
            return time + timedelta(days=index)
        if period == 1: ## 매주
            return time + timedelta(weeks=index)
        if period == 2: ## 매월
            return time + relativedelta(months=index)
        if period == 3: ## 매년
            return time + relativedelta(years=index)

        raise serializers.ValidationError('반복 주기가 올바르지 않습니다.')

    def create_event(self, event_data):
        start_datetime = event_data['start']
        end_datetime = event_data['end']
        alarm = event_data['alarm']

        if event_data['is_allday']:
            start_datetime = event_data['start'].replace(hour=0, minute=0, second=0)
            end_datetime = event_data['end'].replace(hour=23, minute=59, second=59)

        event = Event.objects.create(
            schedule=event_data['schedule'],
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            is_allday=event_data['is_allday'],
        )

        if alarm['use']:
            alarm_time = self.get_alarm_time(event_data['start'], alarm['delta'], alarm['unit'])
            event.notify = True
            event.notify_time = alarm_time

        event.save()

        return event

    def create_events(self, events_data):
        repeat = events_data['repeat']
        alarm = events_data['alarm']

        use_repeat = repeat['use']
        break_rule = repeat['break']
        period = repeat['period']

        if not use_repeat:
            event_data = {
                'schedule': events_data['schedule'],
                'start': events_data['start'],
                'end': events_data['end'],
                'is_allday': events_data['is_allday'],
                'alarm': alarm
            }
            self.create_event(event_data)
        elif break_rule.endswith('회'):
            ## input: 'n회'
            try:
                repeat_count = int(break_rule[:-1])
                for i in range(repeat_count):
                    start_time = self.get_time(events_data['start'], period, i)
                    end_time = self.get_time(events_data['end'], period, i)
                    event_data = {
                        'schedule': events_data['schedule'],
                        'start': start_time,
                        'end': end_time,
                        'is_allday': events_data['is_allday'],
                        'alarm': alarm
                    }
                    self.create_event(event_data)
            except ValueError as e:
                raise serializers.ValidationError('반복 횟수가 올바르지 않습니다.') from e
        elif break_rule.endswith('까지'):
            ## input: 'yyyy.mm.dd까지'
            try:
                repeat_until = datetime.strptime(break_rule[:-2], '%Y.%m.%d')
                i = 0
                while True:
                    start_time = self.get_time(events_data['start'], period, i)
                    end_time = self.get_time(events_data['end'], period, i)
                    if start_time > timezone.make_aware(repeat_until):
                        break
                    event_data = {
                        'schedule': events_data['schedule'],
                        'start': start_time,
                        'end': end_time,
                        'is_allday': events_data['is_allday'],
                        'alarm': alarm
                    }
                    self.create_event(event_data)
                    i += 1
            except ValueError as e:
                raise serializers.ValidationError('반복 종료일이 올바르지 않습니다.') from e
        else:
            raise serializers.ValidationError('잘못된 요청입니다.')

    def create(self, validated_data):
        allowed_auth = [AuthChoices.OWNER, AuthChoices.EDITOR]
        calendar_id = validated_data.pop('calendar_id')
        calendar = Calendar.objects.get(pk=calendar_id)
        user = self.context['request'].user

        if not calendar.calendar_users.filter(user=user, auth__in=allowed_auth).exists():
            raise serializers.ValidationError('권한이 없습니다.')

        with atomic():
            alarm = validated_data.pop('alarm')
            repeat = validated_data.pop('repeat')

            start = validated_data.pop('start_datetime')
            end = validated_data.pop('end_datetime')
            is_allday = validated_data.pop('is_allday')

            schedule = Schedule.objects.create(calendar=calendar, **validated_data)

            events_data = {
                'schedule': schedule,
                'start': start,
                'end': end,
                'is_allday': is_allday,
                'alarm': alarm,
                'repeat': repeat
            }
            self.create_events(events_data)

            return schedule

class EventSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    color       = serializers.SerializerMethodField()
    time        = serializers.SerializerMethodField()
    type        = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ['id', 'type', 'title', 'description', 'color', 'time']

    def get_title(self, obj):
        return obj.schedule.title

    def get_description(self, obj):
        return obj.schedule.description

    def get_color(self, obj):
        return obj.schedule.color

    def get_type(self, obj):  ## pylint: disable=unused-argument
        return '일정'

    def get_time(self, obj):
        if obj.is_allday:
            return '종일'

        start_time = get_time_text(obj.start_datetime)
        end_time = get_time_text(obj.end_datetime)

        duration = obj.end_datetime - obj.start_datetime
        duration_text = get_duration_text(duration)

        return f'{start_time} ~ {end_time} ({duration_text})'

class LessonSerializer(serializers.ModelSerializer):
    program         = serializers.IntegerField(write_only=True)
    coaches         = serializers.ListField(child=serializers.CharField(), write_only=True)
    start_datetime  = serializers.DateTimeField(write_only=True)
    person          = serializers.JSONField(write_only=True)

    class Meta:
        model = Lesson
        fields = ['program', 'coaches', 'start_datetime', 'person']

    def get_or_create_new_student(self, id, name, phone_number):
        if id is not None:
            return Person.objects.get(id=id)

        try:
            person = Person.objects.get(phone_number=phone_number)
        except ObjectDoesNotExist:
            person = Person.objects.create(name=name, phone_number=phone_number)

        return person

    def create_lesson(self, program, coaches, student):
        if Lesson.objects.filter(program=program, student=student).exists():
            lesson = Lesson.objects.get(program=program, student=student)
        else:
            lesson = Lesson.objects.create(program=program, student=student)

        for coach in coaches:
            lesson.coaches.add(coach)
            lesson.save()

        return lesson

    def create_session(self, lesson, start_datetime, program, coaches):
        duration = program.duration
        end_datetime = start_datetime + timedelta(minutes=duration)

        session = Session.objects.create(
            lesson=lesson,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
        )
        session.coaches.set(coaches)

        return session

    def add_student_to_academy(self, student, academy):
        ## add student to academy if not exists
        if not academy.students.filter(pk=student.pk).exists():
            academy.students.add(student)
            academy.save()

    def create(self, validated_data):
        program_id = validated_data.pop('program')
        coach_uuids = validated_data.pop('coaches')
        person_data = validated_data.pop('person')
        name = person_data.get('name', '')
        id = person_data.get('id', None)

        program = Program.objects.get(pk=program_id)
        coaches = [Coach.objects.get(uuid=uuid) for uuid in coach_uuids]
        student = self.get_or_create_new_student(id, name, person_data['phone'])

        self.add_student_to_academy(student, program.academy)

        lesson = self.create_lesson(program, coaches, student)
        self.create_session(lesson, validated_data['start_datetime'], program, coaches)

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
        return f"s{obj.lesson.id}"

    def get_title(self, obj):
        return obj.lesson.program.name

    def get_description(self, obj):
        coaches = ', '.join([coach.person.name for coach in obj.coaches.all()])
        student = obj.lesson.student.name

        return f'코치: {coaches}\t수강생: {student}'

    def get_color(self, obj):  ## pylint: disable=unused-argument
        return "#14863E"

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
    coaches = serializers.SerializerMethodField()
    student = serializers.SerializerMethodField()

    class Meta(SessionSerializer.Meta):
        fields = SessionSerializer.Meta.fields + ['notes', 'feedback', 'coaches', 'student']

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
