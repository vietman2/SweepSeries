from django.db import models

from .enums import FAQCategoryChoices

class FAQ(models.Model):
    category = models.IntegerField(
        choices=FAQCategoryChoices.choices,
        default=FAQCategoryChoices.OTHERS
    )
    question = models.CharField(max_length=255)
    answer = models.TextField()

    ## TODO: add is_active field

    objects = models.Manager()

    class Meta:
        db_table = 'faq'
        ordering = ['id']
