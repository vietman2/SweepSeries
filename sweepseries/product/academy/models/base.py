import uuid
from datetime import time
from django.core.validators import MinValueValidator as Min, MaxValueValidator as Max
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from auth.user.models import User
from ..enums import FacilityTypeChoices, CalendarScopeChoices

class AcademyFacility(models.Model):
    name = models.CharField(max_length=50, unique=True)
    kor_name = models.CharField(max_length=50, unique=True)
    type = models.PositiveSmallIntegerField(choices=FacilityTypeChoices.choices)

    objects = models.Manager()

    def __str__(self):
        type_name = FacilityTypeChoices(self.type).label
        return f"{self.name} ({type_name})"

    class Meta:
        db_table = 'academy_facility'
        verbose_name = '아카데미 시설'
        verbose_name_plural = '아카데미 시설'

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
    cached_rating           = models.FloatField(default=0)
    num_reviews             = models.PositiveIntegerField(default=0)

    is_verified             = models.BooleanField(default=False)
    verified_at             = models.DateTimeField(null=True)
    is_rejected             = models.BooleanField(default=False)
    reject_reason           = models.TextField(blank=True)

    ## 캘린더 설정 (오너의 알림 설정)
    notifications       = models.BooleanField(default=True)
    notifications_today = models.BooleanField(default=True)
    daily_time          = models.TimeField(null=True, blank=True, default=time(9, 0))
    calendar_scope      = models.PositiveSmallIntegerField(
        choices=CalendarScopeChoices.choices, default=CalendarScopeChoices.ALL
    )

    objects                 = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'academy'
        verbose_name = '아카데미'
        verbose_name_plural = '아카데미'

class AcademyImage(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='images')
    image       = models.ImageField()

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_image'
        verbose_name = '아카데미 이미지'
        verbose_name_plural = '아카데미 이미지'

class AcademyLike(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='likes')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_academies')

    liked_at    = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_like'
        verbose_name = '아카데미 좋아요'
        verbose_name_plural = '아카데미 좋아요'
