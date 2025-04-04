from django.db import models

from .utils import random_color_generator, random_nickname_generator

class UserProfile(models.Model):
    user            = models.ForeignKey(
        'user.User', on_delete=models.CASCADE, related_name='profiles'
    )
    nickname        = models.CharField(max_length=150, default=random_nickname_generator)
    profile_image   = models.URLField(null=True)
    default_color   = models.CharField(max_length=7, default=random_color_generator)
    introduction    = models.CharField(max_length=300, default='', blank=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.user.username} - ({self.nickname})"

    class Meta:
        db_table = 'user_profile'
        verbose_name = '회원 프로필'
        verbose_name_plural = '회원 프로필'
        indexes = [
            models.Index(fields=['user']),
        ]
