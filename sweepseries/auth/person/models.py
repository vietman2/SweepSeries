from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from .enums import GenderChoices

class Person(models.Model):
    name                = models.CharField(max_length=150, blank=True)
    phone_number        = PhoneNumberField(unique=True)

    birth_date          = models.DateField(null=True)
    gender              = models.CharField(
        max_length=1,
        choices=GenderChoices.choices,
        default=GenderChoices.UNDEFINED
    )

    objects = models.Manager()

    def __str__(self):
        return f"{self.name}"

    class Meta:
        db_table = 'person'
        verbose_name = '사람'
        verbose_name_plural = '사람들'
        indexes = [
            models.Index(fields=['phone_number']),
        ]
