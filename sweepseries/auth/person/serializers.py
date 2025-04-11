from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers

from product.lesson.models import Session
from product.lesson.serializers import SessionSerializer
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    name            = serializers.CharField(read_only=True)
    phone_number    = serializers.SerializerMethodField(read_only=True)
    birth_date      = serializers.DateField(format='%Y-%m-%d', read_only=True)
    gender          = serializers.CharField(read_only=True, source='get_gender_display')

    class Meta:
        model = Person
        fields = ['name', 'phone_number', 'birth_date', 'gender']

    def get_phone_number(self, obj):
        return obj.phone_number.as_national

class StudentSimpleSerializer(serializers.ModelSerializer):
    phone_number    = serializers.SerializerMethodField(read_only=True)
    profile_image   = serializers.SerializerMethodField(read_only=True)
    default_color   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Person
        fields = ["id", "name", "phone_number", "profile_image", "default_color"]

    def get_phone_number(self, obj):
        number = obj.phone_number.as_national

        ## if phone number is 010-aaaa-bbbb,
        ## return 010-xxxx-xxbb
        if len(number) == 13:
            return f"{number[:3]}-xxxx-{number[-4:]}"

        return number

    def get_profile_image(self, obj):
        try:
            user = obj.user
        except ObjectDoesNotExist:
            return None

        if not user.profiles.first().profile_image:
            return None

        return obj.user.profiles.first().profile_image

    def get_default_color(self, obj):
        try:
            user = obj.user
        except ObjectDoesNotExist:
            return "#83CBFF"

        return user.profiles.first().default_color

class StudentDetailSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Person
        fields = ["id", "name", "lessons"]

    def get_lessons(self, obj):
        lessons = obj.lessons.all()
        month_query = self.context.get('month', None)

        try:
            month_str = month_query.split('-')[1]
            year_str = month_query.split('-')[0]
            month = int(month_str)
            year = int(year_str)
            start_date = datetime(year, month, 1)
            end_date = start_date + relativedelta(months=1)
        except ValueError as e:
            raise serializers.ValidationError("올바른 형식이 아닙니다.") from e
        except AttributeError as e:
            raise serializers.ValidationError("년월을 입력해주세요.") from e

        tz = timezone.get_current_timezone()
        start_date = timezone.make_aware(start_date, tz)
        end_date = timezone.make_aware(end_date, tz)

        q = Q(lesson__in=lessons)
        q &= Q(start_datetime__range=[start_date, end_date])

        sessions = Session.objects.filter(q).order_by('start_datetime')

        return SessionSerializer(sessions, many=True).data
