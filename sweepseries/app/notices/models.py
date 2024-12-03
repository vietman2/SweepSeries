from django.db import models

from core.models import TimeStampedModel

class Notice(TimeStampedModel):
    title = models.CharField(max_length=255)
    content = models.TextField()

    is_deleted = models.BooleanField(default=False)

    objects = models.Manager()

    class Meta:
        db_table = 'notices'
        ordering = ['is_deleted', '-created_at']
