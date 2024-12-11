import uuid
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage
from rest_framework import serializers

from auth.person.models import Person
from product.academy.models import Academy
from .enums import CareerChoices
from .models import Coach

class CoachSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = ["uuid"]

class CoachRegisterSerializer(serializers.ModelSerializer):
    profile_image   = serializers.FileField(write_only=True)
    academy         = serializers.UUIDField(write_only=True)
    career          = serializers.CharField(write_only=True)
    professions     = serializers.JSONField(write_only=True)

    class Meta:
        model = Coach
        fields = ["career", "academy", "profile_image", "professions"]

    def validate_career(self, value):
        for choice in CareerChoices.choices:
            if value in choice:
                return choice[0]

        return CareerChoices.UNDEFINED

    def validate_academy(self, value):
        try:
            academy = Academy.objects.get(uuid=value)

            return academy
        except ObjectDoesNotExist as exc:
            raise serializers.ValidationError("존재하지 않는 아카데미입니다.") from exc

    def validate_professions(self, value):
        professions = []

        if "투수 전문" in value:
            professions.append(1)
        if "타격 전문" in value:
            professions.append(2)
        if "수비 전문" in value:
            professions.append(3)
        if "포수 전문" in value:
            professions.append(4)
        if "트레이닝 전문" in value:
            professions.append(5)
        if "재활 전문" in value:
            professions.append(6)

        return set(professions)

    def upload_profile_image(self, **kwargs):
        new_id = kwargs['uuid']
        file = self.validated_data['profile_image']
        filename = file.name.split('/')[-1]
        path = f"products/coaches/{new_id}/{filename}"
        default_storage.save(path, file)
        return path

    def save(self, **kwargs):
        new_id = uuid.uuid4()
        profile_image = self.upload_profile_image(uuid=new_id)
        user = self.context['request'].user
        person = Person.objects.get(user=user)

        coach = Coach.objects.create(
            uuid=new_id,
            person=person,
            academy=self.validated_data['academy'],
            profile_image=profile_image,
            career=self.validated_data['career'],
        )
        coach.professions.set(self.validated_data['professions'])

        return coach
