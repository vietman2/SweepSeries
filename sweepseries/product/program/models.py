from django.db import models

from product.academy.models import Academy
from product.coach.models import Coach

class Target(models.Model):
    name    = models.CharField(max_length=255)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'program_target'
        verbose_name = '프로그램 대상'
        verbose_name_plural = '프로그램 대상'

class Position(models.Model):
    name    = models.CharField(max_length=255)

    objects = models.Manager()

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'program_position'
        verbose_name = '프로그램 포지션 옵션'
        verbose_name_plural = '프로그램 포지션 옵션'

class CoachTeam(models.Model):
    coaches = models.ManyToManyField(Coach, related_name='coach_teams')

    objects = models.Manager()

    class Meta:
        db_table = 'program_coach_team'
        verbose_name = '코치 팀'
        verbose_name_plural = '코치 팀'

class Program(models.Model):
    academy         = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='programs')
    name            = models.CharField(max_length=255)
    duration        = models.PositiveIntegerField()
    target          = models.ForeignKey(Target, on_delete=models.CASCADE, related_name='programs')
    positions       = models.ManyToManyField(Position, related_name='programs')
    teams           = models.ManyToManyField(CoachTeam, related_name='programs')
    select_disabled = models.BooleanField(default=True)

    cached_rating   = models.FloatField(default=0)
    num_reviews     = models.PositiveIntegerField(default=0)

    objects     = models.Manager()

    class Meta:
        db_table = 'program'
        verbose_name = '프로그램'
        verbose_name_plural = '프로그램'
        unique_together = ('academy', 'name')

class Curriculum(models.Model):
    program     = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='curriculums')
    num_lessons = models.PositiveSmallIntegerField()
    price       = models.IntegerField()

    is_deleted  = models.BooleanField(default=False)

    objects     = models.Manager()

    class Meta:
        db_table = 'program_curriculum'
        verbose_name = '프로그램 커리큘럼'
        verbose_name_plural = '프로그램 커리큘럼'
        unique_together = ('program', 'num_lessons')
