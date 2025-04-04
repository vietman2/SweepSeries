from django.db import models

from core.models import TimeStampedModel

class Notice(TimeStampedModel):
    title = models.CharField(max_length=255)
    content = models.TextField()

    is_deleted = models.BooleanField(default=False)

    objects = models.Manager()

    def __str__(self):
        return f"{self.title}"

    class Meta:
        db_table = 'notices'
        verbose_name = '캐치비 공지사항'
        verbose_name_plural = '캐치비 공지사항'
        ordering = ['is_deleted', '-created_at']
