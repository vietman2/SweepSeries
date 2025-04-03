from django.db import models

from auth.user.models import User
from core.models import TimeStampedModel

class Todo(TimeStampedModel):
    user    = models.ForeignKey(
        User, related_name='todos', on_delete=models.CASCADE
    )
    title       = models.CharField(max_length=100)
    deadline    = models.DateField()
    color       = models.CharField(max_length=7)

    completed   = models.BooleanField(default=False)

    objects     = models.Manager()

    def __str__(self):
        return f'{self.title}'

    class Meta:
        db_table = 'todos'
        verbose_name = '할 일'
        verbose_name_plural = '할 일'
        ordering = ['deadline']
