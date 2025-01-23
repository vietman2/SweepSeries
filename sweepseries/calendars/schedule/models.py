from django.db import models

from calendars.calendarapp.models import Calendar
from core.models import TimeStampedModel
from .enums import RepeatTypeChoices

class Schedule(TimeStampedModel):
    calendar        = models.ForeignKey(
        Calendar, on_delete=models.CASCADE, related_name='schedules'
    )
    title           = models.CharField(max_length=100)
    description     = models.TextField()
    color           = models.CharField(max_length=7)

    repeat_type     = models.CharField(
        max_length=1, choices=RepeatTypeChoices.choices, default=RepeatTypeChoices.NO_REPEAT
    )
    repeat_until    = models.DateTimeField(null=True, blank=True)
    repeat_count    = models.IntegerField(default=0)

    objects         = models.Manager()

    class Meta:
        db_table = 'schedules'
        ordering = ['-created_at']

class Event(models.Model):
    schedule        = models.ForeignKey(
        Schedule, on_delete=models.CASCADE, related_name='events'
    )
    start_datetime  = models.DateTimeField()
    end_datetime    = models.DateTimeField()
    is_allday       = models.BooleanField(default=False)

    notify          = models.BooleanField(default=False)
    notify_time     = models.DateTimeField(null=True, blank=True)

    objects         = models.Manager()

    class Meta:
        db_table = 'events'
        ordering = ['start_datetime']
