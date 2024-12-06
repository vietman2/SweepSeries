from rest_framework import serializers

from auth.person.enums import GenderChoices
from auth.person.models import Person
from auth.person.serializers import PersonSerializer
from auth.userprofile.models import UserProfile
from auth.userprofile.serializers import UserProfileSerializer
from auth.userprofile.utils import random_nickname_generator
from .models import User

class UserAuthSerializer(serializers.ModelSerializer):
    uuid        = serializers.UUIDField(read_only=True)
    username    = serializers.CharField(read_only=True)
    profile     = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['uuid', 'username', 'profile']

    def get_profile(self, obj):
        first_profile = UserProfile.objects.filter(user=obj).first()

        return UserProfileSerializer(first_profile).data

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

class NaverRegisterSerializer(serializers.ModelSerializer):
    username        = serializers.CharField(write_only=True)
    email           = serializers.EmailField(write_only=True)
    name            = serializers.CharField(write_only=True)
    phone_number    = serializers.CharField(write_only=True)
    birthday        = serializers.CharField(write_only=True, allow_blank=True)
    birthyear       = serializers.CharField(write_only=True, allow_blank=True)
    gender          = serializers.CharField(write_only=True, allow_blank=True)
    nickname        = serializers.CharField(write_only=True, allow_blank=True)
    profile_image   = serializers.URLField(write_only=True, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'name', 'phone_number',
            'birthday', 'birthyear', 'gender', 'nickname', 'profile_image'
        ]

    def validate(self, attrs):
        email = attrs['email']

        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError('Email already exists')

        return attrs

    def update_person(self, person, validated_data):
        month = validated_data['birthday'][:2]
        day = validated_data['birthday'][3:5]
        year = validated_data['birthyear']
        person.birth_date = f'{year}-{month}-{day}'

        if validated_data['gender'] == 'M':
            person.gender = GenderChoices.MALE
        elif validated_data['gender'] == 'F':
            person.gender = GenderChoices.FEMALE
        else:
            person.gender = GenderChoices.UNDEFINED

        person.save()

        return person

    def create_user(self, validated_data, person):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=User.objects.make_random_password(),
            naver_linked=True,
            person=person
        )
        if validated_data['nickname'] == '':
            nickname = random_nickname_generator()
        else:
            nickname = validated_data['nickname']
        UserProfile.objects.create(
            user=user, nickname=nickname, profile_image=validated_data['profile_image']
        )

        return user

    def create_user_and_person(self, validated_data):
        person = Person.objects.create(
            name=validated_data['name'],
            phone_number=validated_data['phone_number'],
        )
        person = self.update_person(person, validated_data)
        return self.create_user(validated_data, person)
