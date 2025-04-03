from django.db import models

from community.enums import ForumChoices

class Tag(models.Model):
    forum           = models.IntegerField(choices=ForumChoices.choices)
    name            = models.CharField(max_length=20)

    icon            = models.URLField()
    color           = models.CharField(max_length=7)
    bgcolor         = models.CharField(max_length=7)

    objects = models.Manager()

    def __str__(self):
        forum_display = ForumChoices(self.forum).label
        return f"[{forum_display}] - {self.name}"

    class Meta:
        db_table = 'tag'
        verbose_name = '태그'
        verbose_name_plural = '태그'
        ordering = ['id']
