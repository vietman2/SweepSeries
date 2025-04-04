from django.db import models

from auth.user.models import User

class Diary(models.Model):
    user    = models.ForeignKey(
        User, related_name='diaries', on_delete=models.CASCADE
    )
    diary   = models.TextField()
    date    = models.DateField()

    objects = models.Manager()

    class Meta:
        db_table = 'diaries'
        verbose_name = '다이어리'
        verbose_name_plural = '다이어리'
        ordering = ['date']
        unique_together = ['user', 'date']
