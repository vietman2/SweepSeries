from django.db import models

from community.enums import ForumChoices

class Tag(models.Model):
    forum           = models.IntegerField(choices=ForumChoices.choices)
    name            = models.CharField(max_length=20)

    icon            = models.URLField()
    color           = models.CharField(max_length=7)
    bgcolor         = models.CharField(max_length=7)

    objects = models.Manager()

    class Meta:
        db_table = 'tag'
        ordering = ['id']
