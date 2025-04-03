import uuid
from datetime import time
from django.db import models

from auth.person.models import Person
from auth.user.models import User
from product.academy.models import Academy
from product.validators import validate_30_minutes_interval
from .enums import CareerChoices, CoachApplicationStatus, DayChoices

class CoachProfession(models.Model):
    profession      = models.CharField(max_length=20, unique=True)
    kor_name        = models.CharField(max_length=20, unique=True)

    objects         = models.Manager()

    def __str__(self):
        return self.kor_name

    class Meta:
        db_table = 'coach_profession'
        verbose_name = '코치 전문분야'
        verbose_name_plural = '코치 전문분야'

class Coach(models.Model):
    uuid            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person          = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='coach')
    academy         = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='coaches')

    introduction    = models.TextField()
    certificate     = models.FileField()
    profile_image   = models.ImageField()
    career          = models.IntegerField(
        choices=CareerChoices.choices, default=CareerChoices.UNDEFINED
    )
    professions     = models.ManyToManyField(CoachProfession, related_name='coaches')

    instagram       = models.URLField(max_length=200, blank=True)
    blog            = models.URLField(max_length=200, blank=True)

    cached_rating   = models.FloatField(default=0)
    num_reviews     = models.PositiveIntegerField(default=0)

    is_verified     = models.BooleanField(default=False)
    verified_at     = models.DateTimeField(null=True)
    is_rejected     = models.BooleanField(default=False)
    reject_reason   = models.TextField(blank=True)
    status          = models.SmallIntegerField(
        choices=CoachApplicationStatus.choices, default=CoachApplicationStatus.PENDING
    )

    ## 캘린더 설정
    notifications       = models.BooleanField(default=True)
    notifications_today = models.BooleanField(default=True)
    daily_time          = models.TimeField(null=True, blank=True, default=time(9, 0))

    objects         = models.Manager()

    def __str__(self):
        return f'{self.person} - ({self.academy})'

    class Meta:
        db_table = 'coach'
        verbose_name = '코치'
        verbose_name_plural = '코치'

class CoachLike(models.Model):
    coach       = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='likes')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_coaches')

    liked_at    = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'coach_like'
        verbose_name = '코치 좋아요'
        verbose_name_plural = '코치 좋아요'

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
