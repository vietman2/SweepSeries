from datetime import time
from django.db import models

from product.validators import validate_30_minutes_interval
from .base import Academy
from ..enums import DayChoices

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
    open_time   = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    close_time  = models.TimeField(default=time(21, 0), validators=[validate_30_minutes_interval])
    day_of_week = models.PositiveSmallIntegerField(
        choices=DayChoices.choices
    )
    is_closed   = models.BooleanField(default=False)
    is_allday   = models.BooleanField(default=False)

    objects     = BusinessHoursManager()

    class Meta:
        db_table = 'business_hours'
        verbose_name = '아카데미 운영시간'
        verbose_name_plural = '아카데미 운영시간'
        unique_together = ('academy', 'day_of_week')

class SpecialDay(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='special_days')

    date        = models.DateField()
    reason      = models.CharField(max_length=50)
    start_time  = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    end_time    = models.TimeField(default=time(21, 0), validators=[validate_30_minutes_interval])
    is_closed   = models.BooleanField(default=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'special_day'
        verbose_name = '아카데미 특별 일정'
        verbose_name_plural = '아카데미 특별 일정'
        unique_together = ('academy', 'date')
