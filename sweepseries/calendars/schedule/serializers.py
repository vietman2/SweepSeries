from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.db.transaction import atomic
from django.utils import timezone
from rest_framework import serializers

from core.utils import get_time_text, get_duration_text
from product.academy.models import Academy
from .models import BaseSchedule, PersonalSchedule, AcademySchedule, PersonalEvent, AcademyEvent

class BaseScheduleSerializer(serializers.ModelSerializer):
    start_datetime  = serializers.DateTimeField(write_only=True)
    end_datetime    = serializers.DateTimeField(write_only=True)
    is_allday       = serializers.BooleanField(write_only=True)
    alarm           = serializers.JSONField(write_only=True)
    repeat          = serializers.JSONField(write_only=True)

    class Meta:
        model = BaseSchedule
        fields = [
            'id', 'title', 'description', 'color', 'is_allday',
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

class PersonalScheduleSerializer(BaseScheduleSerializer):
    class Meta(BaseScheduleSerializer.Meta):
        model = PersonalSchedule

    def create_event(self, event_data):
        start_datetime = event_data['start']
        end_datetime = event_data['end']
        alarm = event_data['alarm']

        if event_data['is_allday']:
            start_datetime = event_data['start'].replace(hour=0, minute=0, second=0)
            end_datetime = event_data['end'].replace(hour=23, minute=59, second=59)

        event = PersonalEvent.objects.create(
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
        with atomic():
            request = self.context['request']
            alarm = validated_data.pop('alarm')
            repeat = validated_data.pop('repeat')

            start = validated_data.pop('start_datetime')
            end = validated_data.pop('end_datetime')
            is_allday = validated_data.pop('is_allday')

            schedule = PersonalSchedule.objects.create(user=request.user, **validated_data)

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

class AcademyScheduleSerializer(BaseScheduleSerializer):
    uuid = serializers.UUIDField(write_only=True)

    class Meta(BaseScheduleSerializer.Meta):
        model = AcademySchedule
        fields = BaseScheduleSerializer.Meta.fields + ['uuid']

    def create_event(self, event_data):
        start_datetime = event_data['start']
        end_datetime = event_data['end']
        alarm = event_data['alarm']

        if event_data['is_allday']:
            start_datetime = event_data['start'].replace(hour=0, minute=0, second=0)
            end_datetime = event_data['end'].replace(hour=23, minute=59, second=59)

        event = AcademyEvent.objects.create(
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
        with atomic():
            alarm = validated_data.pop('alarm')
            repeat = validated_data.pop('repeat')

            start = validated_data.pop('start_datetime')
            end = validated_data.pop('end_datetime')
            is_allday = validated_data.pop('is_allday')

            academy = Academy.objects.get(uuid=validated_data.pop('uuid'))

            schedule = AcademySchedule.objects.create(academy=academy, **validated_data)

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

class PersonalEventSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    color       = serializers.SerializerMethodField()
    time        = serializers.SerializerMethodField()

    class Meta:
        model = PersonalEvent
        fields = ['id', 'title', 'description', 'color', 'time']

    def get_title(self, obj):
        return obj.schedule.title

    def get_description(self, obj):
        return obj.schedule.description

    def get_color(self, obj):
        return obj.schedule.color

    def get_time(self, obj):
        if obj.is_allday:
            return '종일'

        start_time = get_time_text(obj.start_datetime)
        end_time = get_time_text(obj.end_datetime)

        duration = obj.end_datetime - obj.start_datetime
        duration_text = get_duration_text(duration)

        return f'{start_time} ~ {end_time} ({duration_text})'

class AcademyEventSerializer(serializers.ModelSerializer):
    title       = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    color       = serializers.SerializerMethodField()
    time        = serializers.SerializerMethodField()

    class Meta:
        model = AcademyEvent
        fields = ['id', 'title', 'description', 'color', 'time']

    def get_title(self, obj):
        return obj.schedule.title

    def get_description(self, obj):
        return obj.schedule.description

    def get_color(self, obj):
        return obj.schedule.color

    def get_time(self, obj):
        if obj.is_allday:
            return '종일'

        start_time = get_time_text(obj.start_datetime)
        end_time = get_time_text(obj.end_datetime)

        duration = obj.end_datetime - obj.start_datetime
        duration_text = get_duration_text(duration)

        return f'{start_time} ~ {end_time} ({duration_text})'
