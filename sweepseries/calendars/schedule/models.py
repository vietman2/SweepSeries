from django.db import models

from auth.user.models import User
from core.models import TimeStampedModel
from product.academy.models import Academy
from .enums import RepeatTypeChoices

class BaseSchedule(TimeStampedModel):
    title           = models.CharField(max_length=100)
    description     = models.TextField(blank=True)
    color           = models.CharField(max_length=7)

    repeat_type     = models.CharField(
        max_length=1, choices=RepeatTypeChoices.choices, default=RepeatTypeChoices.NO_REPEAT
    )
    repeat_until    = models.DateTimeField(null=True, blank=True)
    repeat_count    = models.IntegerField(default=0)

    objects         = models.Manager()

    class Meta:
        abstract = True

class PersonalSchedule(BaseSchedule):
    user            = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='personal_schedules'
    )

    class Meta:
        db_table = 'personal_schedules'
        verbose_name = '개인 일정'
        verbose_name_plural = '개인 일정'
        ordering = ['-created_at']

class AcademySchedule(BaseSchedule):
    academy         = models.ForeignKey(
        Academy, on_delete=models.CASCADE, related_name='academy_schedules'
    )

    class Meta:
        db_table = 'academy_schedules'
        verbose_name = '아카데미 일정'
        verbose_name_plural = '아카데미 일정'
        ordering = ['-created_at']

class BaseEvent(models.Model):
    start_datetime  = models.DateTimeField()
    end_datetime    = models.DateTimeField()
    is_allday       = models.BooleanField(default=False)

    notify          = models.BooleanField(default=False)
    notify_time     = models.DateTimeField(null=True, blank=True)

    objects         = models.Manager()

    class Meta:
        abstract = True

class PersonalEvent(BaseEvent):
    schedule        = models.ForeignKey(
        PersonalSchedule, on_delete=models.CASCADE, related_name='personal_events'
    )

    class Meta:
        db_table = 'personal_events'
        verbose_name = '개인 일정 상세'
        verbose_name_plural = '개인 일정 상세'
        ordering = ['start_datetime']

class AcademyEvent(BaseEvent):
    schedule        = models.ForeignKey(
        AcademySchedule, on_delete=models.CASCADE, related_name='academy_events'
    )

    class Meta:
        db_table = 'academy_events'
        verbose_name = '아카데미 일정 상세'
        verbose_name_plural = '아카데미 일정 상세'
        ordering = ['start_datetime']
