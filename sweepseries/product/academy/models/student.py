from datetime import time
from django.db import models

from auth.person.models import Person
from .base import Academy

class AcademyStudent(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='students')
    person      = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name='academies'
    )

    joined_at   = models.DateTimeField(auto_now_add=True)

    ## 캘린더 설정
    notifications       = models.BooleanField(default=True)
    notifications_today = models.BooleanField(default=True)
    daily_time          = models.TimeField(null=True, blank=True, default=time(9, 0))

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_student'
        verbose_name = '아카데미 학생'
        verbose_name_plural = '아카데미 학생'
        unique_together = ('academy', 'person')
