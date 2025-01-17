from django.db import models

from calendars.calendarapp.models import Calendar
from core.models import TimeStampedModel

class Todo(TimeStampedModel):
    calendar    = models.ForeignKey(
        Calendar, on_delete=models.CASCADE, related_name='todos'
    )
    title       = models.CharField(max_length=100)
    deadline    = models.DateField()
    color       = models.CharField(max_length=7)

    completed   = models.BooleanField(default=False)

    objects     = models.Manager()

    def __str__(self):
        return self.title

    class Meta:
        db_table = 'todos'
        ordering = ['deadline']
