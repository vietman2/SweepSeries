from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from django.db.transaction import atomic
from rest_framework import serializers

from calendars.calendarapp.enums import AuthChoices
from calendars.calendarapp.models import Calendar
from .models import Schedule, Event

class ScheduleSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = ['id', 'title', 'color']

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

    def validate(self, data):
        ## 일정 시작 시간이 종료 시간보다 빠른지 확인
        if data['start_datetime'] >= data['end_datetime']:
            raise serializers.ValidationError('일정 시작 시간이 종료 시간보다 빠릅니다.')

        return data

    def get_alarm_time(self, start_datetime, delta, unit):
        units = {0: 'minutes', 1: 'hours', 2: 'days', 3: 'weeks'}

        if unit not in units:
            raise serializers.ValidationError('알람 시간 단위가 올바르지 않습니다.')

        return start_datetime - timedelta(**{units[unit]: delta})

    def get_time(self, time, period, index):
        if period == 0: ## 매일
            return time + timedelta(days=index)
        elif period == 1: ## 매주
            return time + timedelta(weeks=index)
        elif period == 2: ## 매월
            return time + relativedelta(months=index)
        elif period == 3: ## 매년
            return time + relativedelta(years=index)
        else:
            raise serializers.ValidationError('반복 주기가 올바르지 않습니다.')

    def create_event(self, schedule, alarm, is_allday, start, end):
        start_datetime = start
        end_datetime = end
        if is_allday:
            start_datetime = start.replace(hour=0, minute=0, second=0)
            end_datetime = end.replace(hour=23, minute=59, second=59)

        event = Event.objects.create(
            schedule=schedule,
            start_datetime=start_datetime,
            end_datetime=end_datetime,
            is_allday=is_allday,
        )

        if alarm['use']:
            alarm_time = self.get_alarm_time(start, alarm['delta'], alarm['unit'])
            event.notify = True
            event.notify_time = alarm_time

        event.save()

        return event

    def create_events(self, schedule, alarm, repeat, is_allday, start, end):
        use_repeat = repeat['use']
        break_rule = repeat['break']
        period = repeat['period']

        if not use_repeat:
            self.create_event(schedule, alarm, is_allday, start, end)
        elif break_rule.endswith('회'):
            ## input: 'n회'
            try:
                repeat_count = int(break_rule[:-1])
                for i in range(repeat_count):
                    start_time = self.get_time(start, period, i)
                    end_time = self.get_time(end, period, i)
                    self.create_event(schedule, alarm, is_allday, start_time, end_time)
            except ValueError:
                raise serializers.ValidationError('반복 횟수가 올바르지 않습니다.')
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
                    self.create_event(schedule, alarm, is_allday, start_time, end_time)
                    i += 1
            except ValueError:
                raise serializers.ValidationError('반복 종료일이 올바르지 않습니다.')
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
