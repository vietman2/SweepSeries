from datetime import datetime
from django.contrib.auth.password_validation import validate_password
from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from auth.person.enums import GenderChoices
from auth.person.models import Person
from auth.person.serializers import PersonSerializer
from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from auth.userprofile.utils import random_nickname_generator
from product.academy.models import Academy
from product.coach.models import Coach
from .models import User
from .validators import UsernameValidator, EmailValidator

class UserAuthSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    profile     = serializers.SerializerMethodField(read_only=True)
    mode        = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'profile', 'mode']

    def get_profile(self, obj):
        first_profile = UserProfile.objects.filter(user=obj).first()

        return UserProfileSerializer(first_profile).data

    def get_mode(self, obj):
        ## 아카데미 대표이거나
        ## 그 외의 경우 "normal"
        if Academy.objects.filter(owner=obj).exists():
            return 'pro'

        if Coach.objects.filter(person__user=obj).exists():
            return 'pro'

        return 'normal'

class UserRelatedSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    name   = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'name']

    def get_name(self, obj):
        return obj.person.name

class UserSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    email       = serializers.EmailField(read_only=True)
    person      = PersonSerializer(read_only=True)
    joined_at   = serializers.DateTimeField(read_only=True, format='%Y-%m-%d')
    profiles    = UserProfileSerializer(many=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'email', 'person', 'joined_at', 'profiles']

class RegisterSerializer(serializers.ModelSerializer):
    mode            = serializers.CharField(write_only=True)
    user            = serializers.JSONField(write_only=True)
    profile         = serializers.JSONField(write_only=True)
    notifications   = serializers.BooleanField(write_only=True)

    class Meta:
        model = User
        fields = ['mode', 'user', 'profile', 'notifications']

    def validate(self, attrs):
        mode = attrs['mode']
        user = attrs['user']

        if mode == 'catchb':
            username = user['username']

            username_validator = UsernameValidator()

            try:
                username_validator(username)
            except ValidationError as e:
                raise ValidationError(e.detail[0])

            password = user['password']
            password2 = user.pop('password2')

            if password != password2:
                raise ValidationError('Passwords do not match')

            try:
                validate_password(password)
            except ValidationError as e:
                raise ValidationError(e)
        else:
            user['password'] = User.objects.make_random_password()
            user.pop('password2')

        email = user['email']
        email_validator = EmailValidator()

        try:
            email_validator(email)
        except ValidationError as e:
            raise ValidationError(e.detail[0])

        return attrs

    def validate_mode(self, value):
        options = ['catchb', 'naver', 'kakao']

        if value not in options:
            raise ValidationError('잘못된 mode 입력입니다.')

        return value

    def validate_user(self, value):
        must_have = ['username', 'email', 'password', 'password2', 'name', 'phone']

        for key in must_have:
            if key not in value:
                raise ValidationError(f'{key} is required')

        value['email'] = value['email'].lower()

        return value

    def set_mode(self, validated_data):
        mode = validated_data.pop('mode')

        if mode == 'kakao':
            validated_data['user']['kakao_linked'] = True
        elif mode == 'naver':
            validated_data['user']['naver_linked'] = True

        return validated_data

    def set_birthdate(self, profile_data):
        birthdate_data = profile_data.pop('birthdate')

        if not birthdate_data:
            birth_date = None
        
        ## if birthdate_data does not have YYYY-MM-DD format
        try:
            birth_date = datetime.strptime(birthdate_data, '%Y-%m-%d')
        except ValueError:
            birth_date = None

        return birth_date

    def set_gender(self, profile_data):
        gender_data = profile_data.pop('gender')

        if gender_data == '남성':
            return GenderChoices.MALE
        elif gender_data == '여성':
            return GenderChoices.FEMALE
        elif gender_data == '기타':
            return GenderChoices.OTHER

        return GenderChoices.UNDEFINED

    def create_person(self, user_data, profile_data):
        birth_date = self.set_birthdate(profile_data)
        gender = self.set_gender(profile_data)

        person = Person.objects.create(
            name=user_data.pop('name'),
            phone_number=user_data.pop('phone'),
            birth_date=birth_date,
            gender=gender,
        )

        return person

    def create_profile(self, user, profile_data):
        nickname = profile_data.pop('nickname')
        profile_image = profile_data.pop('profileImage')

        if profile_image == '':
            profile_image = None

        UserProfile.objects.create(
            user=user,
            nickname=nickname,
            profile_image=profile_image,
        )

    def set_notifications(self, user, notifications):
        if notifications:
            user.noti_permitted = True
            user.agreed_at = datetime.now()

        return user

    def create(self, validated_data):
        validated_data = self.set_mode(validated_data)

        user_data = validated_data.pop('user')
        profile_data = validated_data.pop('profile')

        with atomic():
            person = self.create_person(user_data, profile_data)

            user = User.objects.create_user(
                person=person,
                **user_data,
            )
            user = self.set_notifications(user, validated_data.pop('notifications'))
            user.save()

            self.create_profile(user, profile_data)

        return user
