from datetime import datetime
from django.db import models

from auth.user.models import User
from core.models import TimeStampedModel

class Inquiry(TimeStampedModel):
    title       = models.CharField(max_length=255)
    description = models.TextField()
    reply       = models.TextField(blank=True, null=True)

    user        = models.ForeignKey(User, on_delete=models.CASCADE)

    resolved    = models.BooleanField(default=False)
    replied     = models.BooleanField(default=False)

    objects     = models.Manager()

    def __str__(self):
        user: User = self.user
        created_at: datetime = self.created_at
        return f"{self.title} - {user.email} ({created_at.strftime('%Y-%m-%d')})"

    class Meta:
        db_table = 'inquiries'
        verbose_name = '문의'
        verbose_name_plural = '문의'
