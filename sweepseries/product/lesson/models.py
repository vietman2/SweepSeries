from django.db import models

from auth.person.models import Person
from core.models import TimeStampedModel
from product.coach.models import Coach
from product.contract.models import Contract
from product.program.models import Program, Curriculum
from product.validators import validate_30_minutes_interval

class Lesson(TimeStampedModel):
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='lessons')
    student = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='lessons')
    coaches = models.ManyToManyField(Coach, related_name='lessons')

    objects = models.Manager()

    class Meta:
        db_table = 'lessons'
        verbose_name = '레슨'
        verbose_name_plural = '레슨'
        unique_together = ('program', 'student')

class Session(models.Model):
    lesson          = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='sessions')
    coaches         = models.ManyToManyField(Coach, related_name='sessions')
    contract        = models.ForeignKey(
        Contract,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    start_datetime  = models.DateTimeField(validators=[validate_30_minutes_interval])
    end_datetime    = models.DateTimeField(validators=[validate_30_minutes_interval])

    notify          = models.BooleanField(default=False)
    notify_time     = models.DateTimeField(null=True, blank=True)

    notes           = models.TextField(blank=True)
    feedback        = models.TextField(blank=True)

    objects         = models.Manager()

    class Meta:
        db_table = 'sessions'
        verbose_name = '레슨 세션'
        verbose_name_plural = '레슨 세션'

class SessionRequest(TimeStampedModel):
    program         = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='requests')
    student         = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='requests')
    coaches         = models.ManyToManyField(Coach, blank=True, related_name='requests')
    curriculum      = models.ForeignKey(
        Curriculum, on_delete=models.CASCADE, related_name='requests'
    )
    start_datetime  = models.DateTimeField(validators=[validate_30_minutes_interval])

    accepted        = models.BooleanField(default=False)
    rejected        = models.BooleanField(default=False)

    objects         = models.Manager()

    class Meta:
        db_table = 'session_requests'
        verbose_name = '레슨 요청'
        verbose_name_plural = '레슨 요청'

class ScheduleChangeRequest(TimeStampedModel):
    session             = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name='schedule_change_requests'
    )
    new_start_datetime  = models.DateTimeField(validators=[validate_30_minutes_interval])
    new_end_datetime    = models.DateTimeField(validators=[validate_30_minutes_interval])

    accepted            = models.BooleanField(default=False)
    rejected            = models.BooleanField(default=False)

    objects         = models.Manager()

    class Meta:
        db_table = 'schedule_change_requests'
        verbose_name = '레슨 일정 변경 요청'
        verbose_name_plural = '레슨 일정 변경 요청'
