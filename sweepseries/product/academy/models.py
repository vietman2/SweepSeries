import uuid
from django.core.validators import MinValueValidator as Min, MaxValueValidator as Max
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from auth.user.models import User
from .enums import FacilityTypeChoices

class AcademyFacility(models.Model):
    name = models.CharField(max_length=50, unique=True)
    kor_name = models.CharField(max_length=50, unique=True)
    type = models.PositiveSmallIntegerField(choices=FacilityTypeChoices.choices)

    objects = models.Manager()

    class Meta:
        db_table = 'academy_facility'

class Academy(models.Model):
    uuid                    = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False
    )
    name                    = models.CharField(max_length=50)
    owner                   = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='academies'
    )
    academy_phone_number    = PhoneNumberField()
    registration_number     = models.CharField(max_length=12, unique=True)
    certificate             = models.FileField()
    logo                    = models.ImageField()

    introduction            = models.TextField()
    address                 = models.OneToOneField(
        'address.Address', on_delete=models.CASCADE, related_name='academy',
    )
    convenience             = models.ManyToManyField(
        AcademyFacility, related_name='academies', blank=True
    )
    homepage                = models.URLField(blank=True)
    instagram               = models.URLField(blank=True)
    blog                    = models.URLField(blank=True)

    num_mounds              = models.PositiveSmallIntegerField(
        validators=[Min(0), Max(5)], default=0
    )
    num_plates              = models.PositiveSmallIntegerField(
        validators=[Min(0), Max(5)], default=0
    )

    is_verified             = models.BooleanField(default=False)

    objects                 = models.Manager()

    class Meta:
        db_table = 'academy'

class AcademyLike(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='likes')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_academies')

    liked_at    = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_like'

class AcademyReview(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='reviews')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='academy_reviews')

    title       = models.CharField(max_length=50)
    content     = models.TextField()
    rating      = models.PositiveSmallIntegerField(validators=[Min(1), Max(5)])

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_review'
