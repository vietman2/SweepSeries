import uuid
from django.core.validators import MinValueValidator as Min, MaxValueValidator as Max
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from auth.person.models import Person
from auth.user.models import User
from .enums import FacilityTypeChoices, DayChoices, NoticeTypeChoices

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
    verified_at             = models.DateTimeField(null=True)
    is_rejected             = models.BooleanField(default=False)
    reject_reason           = models.TextField(blank=True)

    students                = models.ManyToManyField(
        Person, related_name='academies', blank=True
    )

    objects                 = models.Manager()

    class Meta:
        db_table = 'academy'

class AcademyImage(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='images')
    image       = models.ImageField()

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_image'

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

    content     = models.TextField()
    rating      = models.PositiveSmallIntegerField(validators=[Min(1), Max(5)])

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_review'

class BusinessHoursManager(models.Manager):
    def create_business_hours(self, academy):
        self.create(academy=academy, day_of_week=DayChoices.MONDAY)
        self.create(academy=academy, day_of_week=DayChoices.TUESDAY)
        self.create(academy=academy, day_of_week=DayChoices.WEDNESDAY)
        self.create(academy=academy, day_of_week=DayChoices.THURSDAY)
        self.create(academy=academy, day_of_week=DayChoices.FRIDAY)
        self.create(academy=academy, day_of_week=DayChoices.SATURDAY)
        self.create(academy=academy, day_of_week=DayChoices.SUNDAY)

        return True

class BusinessHours(models.Model):
    academy     = models.ForeignKey(
        Academy, on_delete=models.CASCADE, related_name='business_hours'
    )
    open_time   = models.TimeField(default="09:00:00")
    close_time  = models.TimeField(default="21:00:00")
    day_of_week = models.PositiveSmallIntegerField(
        choices=DayChoices.choices
    )
    is_closed   = models.BooleanField(default=False)
    is_allday   = models.BooleanField(default=False)

    objects     = BusinessHoursManager()

    class Meta:
        db_table = 'business_hours'
        unique_together = ('academy', 'day_of_week')

class AcademyNotice(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='notices')
    title       = models.CharField(max_length=100)
    content     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    type        = models.PositiveSmallIntegerField(
        choices=NoticeTypeChoices.choices, default=NoticeTypeChoices.NOTICE
    )

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_notice'
        ordering = ['-created_at']

class AcademyNoticeAttachment(models.Model):
    notice      = models.ForeignKey(
        AcademyNotice, on_delete=models.CASCADE, related_name='attachments'
    )
    file        = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_notice_attachment'
