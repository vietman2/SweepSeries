from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.db.transaction import atomic
from rest_framework import serializers

from calendars.calendarapp.enums import AuthChoices
from calendars.calendarapp.models import Calendar
from .models import Schedule, Event

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

    def create_events(self, schedule, alarm, repeat, is_allday, start, end):
        use_repeat = repeat['use']
        break_rule = repeat['break']
        period = repeat['period']

        if not use_repeat:
            event_data = {
                'schedule': schedule,
                'start': start,
                'end': end,
                'is_allday': is_allday,
                'alarm': alarm
            }
            self.create_event(event_data)
        elif break_rule.endswith('회'):
            ## input: 'n회'
            try:
                repeat_count = int(break_rule[:-1])
                for i in range(repeat_count):
                    start_time = self.get_time(start, period, i)
                    end_time = self.get_time(end, period, i)
                    event_data = {
                        'schedule': schedule,
                        'start': start_time,
                        'end': end_time,
                        'is_allday': is_allday,
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
                    start_time = self.get_time(start, period, i)
                    end_time = self.get_time(end, period, i)
                    if start_time > repeat_until:
                        break
                    event_data = {
                        'schedule': schedule,
                        'start': start_time,
                        'end': end_time,
                        'is_allday': is_allday,
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

            self.create_events(schedule, alarm, repeat, is_allday, start, end)

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

    def get_type(self, obj):
        return '일정'

    def get_time_text(self, time):
        ampm = '오전'
        hour = time.strftime('%H')
        minute = time.strftime('%M')

        if hour > '12':
            ampm = '오후'
            hour = int(hour) - 12

        if minute == '00':
            return f'{ampm} {hour}시'

        return f'{ampm} {hour}시 {minute}분'

    def get_duration_text(self, duration):
        days = duration.days
        hours, remainder = divmod(duration.seconds, 3600)
        minutes, _ = divmod(remainder, 60)

        days_text = f'{days}일' if days else ''
        hours_text = f'{hours}시간' if hours else ''
        minutes_text = f'{minutes}분' if minutes else ''

        return ' '.join([text for text in [days_text, hours_text, minutes_text] if text])

    def get_time(self, obj):
        if obj.is_allday:
            return '종일'

        start_time = self.get_time_text(obj.start_datetime)
        end_time = self.get_time_text(obj.end_datetime)

        duration = obj.end_datetime - obj.start_datetime
        duration_text = self.get_duration_text(duration)

        return f'{start_time} ~ {end_time} ({duration_text})'
