from datetime import time
from django.db import models

from product.validators import validate_30_minutes_interval
from .base import Coach
from ..enums import DayChoices

class WorkingHoursManager(models.Manager):
    def create_working_hours(self, coach):
        self.create(coach=coach, day_of_week=DayChoices.MONDAY)
        self.create(coach=coach, day_of_week=DayChoices.TUESDAY)
        self.create(coach=coach, day_of_week=DayChoices.WEDNESDAY)
        self.create(coach=coach, day_of_week=DayChoices.THURSDAY)
        self.create(coach=coach, day_of_week=DayChoices.FRIDAY)
        self.create(coach=coach, day_of_week=DayChoices.SATURDAY)
        self.create(coach=coach, day_of_week=DayChoices.SUNDAY)

        return coach

class CoachWorkingHours(models.Model):
    coach       = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='working_hours')

    day_of_week = models.PositiveSmallIntegerField(
        choices=DayChoices.choices
    )
    start_time  = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    end_time    = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    is_off      = models.BooleanField(default=False)

    objects     = WorkingHoursManager()

    class Meta:
        db_table = 'coach_working_hours'
        verbose_name = '코치 근무시간'
        verbose_name_plural = '코치 근무시간'
        unique_together = ('coach', 'day_of_week')

class SpecialWorkingDay(models.Model):
    coach       = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='special_days')

    date        = models.DateField()
    reason      = models.CharField(max_length=50)
    start_time  = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    end_time    = models.TimeField(default=time(9, 0), validators=[validate_30_minutes_interval])
    is_off      = models.BooleanField(default=False)

    objects     = models.Manager()

    class Meta:
        db_table = 'special_working_day'
        verbose_name = '코치 특별 근무일'
        verbose_name_plural = '코치 특별 근무일'
        unique_together = ('coach', 'date')
