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

    class Meta:
        db_table = 'user_profile'
        indexes = [
            models.Index(fields=['user']),
        ]
