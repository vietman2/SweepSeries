from django.db import models

from auth.user.models import User
from .enums import ColorChoices, AuthChoices

class Calendar(models.Model):
    name    = models.CharField(max_length=200)

    objects = models.Manager()

    class Meta:
        db_table = 'calendar'

class CalendarUser(models.Model):
    user                = models.ForeignKey(
        User, related_name='calendar_users', on_delete=models.CASCADE
    )
    color               = models.CharField(
        max_length=7, choices=ColorChoices.choices, default=ColorChoices.RED
    )
    calendar            = models.ForeignKey(
        Calendar, related_name='calendar_users', on_delete=models.CASCADE
    )
    auth                = models.IntegerField(
        choices=AuthChoices.choices, default=AuthChoices.VIEWER
    )
    display_name        = models.CharField(max_length=200)
    notifications       = models.BooleanField(default=True)
    notifications_today = models.BooleanField(default=True)

    objects = models.Manager()

    class Meta:
        db_table = 'calendar_user'
        unique_together = ('user', 'calendar')
