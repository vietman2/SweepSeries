from django.db import models

from .enums import FAQCategoryChoices

class FAQ(models.Model):
    category    = models.IntegerField(
        choices=FAQCategoryChoices.choices,
        default=FAQCategoryChoices.OTHERS
    )
    question    = models.CharField(max_length=255)
    answer      = models.TextField()

    is_active   = models.BooleanField(default=True)

    objects     = models.Manager()

    def __str__(self):
        category_display = dict(FAQCategoryChoices.choices).get(self.category)
        return f"{category_display} - {self.question}"

    class Meta:
        db_table = 'faq'
        verbose_name = '자주 묻는 질문'
        verbose_name_plural = '자주 묻는 질문'
        ordering = ['id']
