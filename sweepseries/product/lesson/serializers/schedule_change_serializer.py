from datetime import datetime, timedelta
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import serializers

from ..models import ScheduleChangeRequest, Session

class ScheduleChangeRequestSerializer(serializers.ModelSerializer):
    session_id  = serializers.IntegerField(write_only=True)
    date        = serializers.CharField(write_only=True)
    time        = serializers.CharField(write_only=True)

    class Meta:
        model = ScheduleChangeRequest
        fields = ["session_id", "date", "time"]
        read_only_fields = ["session", "start_datetime", "end_datetime"]

    def validate(self, attrs):
        ## 세션이 존재하는지 확인
        ## 세션이 존재하지 않으면, ValidationError 발생
        session_id = attrs.pop("session_id")

        try:
            session = Session.objects.get(id=session_id)
            attrs["session"] = session
        except ObjectDoesNotExist as e:
            raise serializers.ValidationError("세션이 존재하지 않습니다.") from e

        ## convert date and time to datetime
        date = attrs.pop("date")
        time = attrs.pop("time")

        try:
            date_time_str = f"{date} {time}"
            date_time_obj = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M")
            start_time = timezone.make_aware(date_time_obj)
            duration = session.lesson.program.duration
            attrs["start_datetime"] = start_time
            attrs["end_datetime"] = start_time + timedelta(minutes=duration)
        except ValueError as e:
            raise serializers.ValidationError("날짜와 시간 형식이 잘못되었습니다.") from e

        return attrs

    def create(self, validated_data):
        session = validated_data.pop("session")
        schedule_change_request = ScheduleChangeRequest.objects.create(
            session=session,
            new_start_datetime=validated_data["start_datetime"],
            new_end_datetime=validated_data["end_datetime"]
        )

        return schedule_change_request
