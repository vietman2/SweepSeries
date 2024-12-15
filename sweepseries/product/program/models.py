from django.db import models

from product.academy.models import Academy

class Target(models.Model):
    name    = models.CharField(max_length=255)

    objects = models.Manager()

    class Meta:
        db_table = 'program_target'

class Position(models.Model):
    name    = models.CharField(max_length=255)

    objects = models.Manager()

    class Meta:
        db_table = 'program_position'

class Program(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='programs')
    name        = models.CharField(max_length=255)
    duration    = models.PositiveIntegerField()
    target      = models.ForeignKey(Target, on_delete=models.CASCADE, related_name='programs')
    positions   = models.ManyToManyField(Position, related_name='programs')

    objects     = models.Manager()

    class Meta:
        db_table = 'program'
        unique_together = ('academy', 'name')

class Curriculum(models.Model):
    program     = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='curriculums')
    num_lessons = models.PositiveSmallIntegerField()
    price       = models.IntegerField()

    objects     = models.Manager()

    class Meta:
        db_table = 'program_curriculum'
        unique_together = ('program', 'num_lessons')
