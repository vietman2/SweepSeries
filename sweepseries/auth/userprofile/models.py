from django.db import models

from .utils import random_color_generator, random_nickname_generator

class UserProfile(models.Model):
    user            = models.OneToOneField('user.User', on_delete=models.CASCADE)
    nickname        = models.CharField(max_length=150, default=random_nickname_generator)
    profile_image   = models.ImageField(null=True)
    default_color   = models.CharField(max_length=7, default=random_color_generator)

    objects = models.Manager()

    def __str__(self):
        return f"{self.user.username} ({self.nickname})"

    class Meta:
        db_table = 'user_profile'
        verbose_name = '프로필'
        verbose_name_plural = '프로필'
        indexes = [
            models.Index(fields=['user']),
        ]
