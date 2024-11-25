from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from .enums import GenderChoices

class Person(models.Model):
    first_name          = models.CharField(max_length=150, blank=True)
    last_name           = models.CharField(max_length=150, blank=True)
    phone_number        = PhoneNumberField(unique=True)

    birth_date          = models.DateField(null=True)
    gender          = models.CharField(
        max_length=1,
        choices=GenderChoices.choices,
        default=GenderChoices.UNDEFINED
    )

    objects = models.Manager()

    @property
    def full_name(self):
        return f"{self.last_name}{self.first_name}"

    def __str__(self):
        return f"{self.full_name} ({self.phone_number})"

    class Meta:
        db_table = 'person'
        verbose_name = '야구인'
        verbose_name_plural = '야구인'
        indexes = [
            models.Index(fields=['phone_number']),
        ]
