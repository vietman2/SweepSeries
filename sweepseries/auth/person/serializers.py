from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers

from calendars.schedule.models import Session
from calendars.schedule.serializers import SessionSerializer
from core.utils import get_presigned_url
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
            return f"{number[:9]}xx{number[-2:]}"

        return number

    def get_profile_image(self, obj):
        try:
            user = obj.user
        except ObjectDoesNotExist:
            return None

        if not user.profiles.first().profile_image:
            return None

        return get_presigned_url(obj.user.profiles.first().profile_image)

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
        sessions = Session.objects.filter(lesson__in=lessons)

        return SessionSerializer(sessions, many=True).data
