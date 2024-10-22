from django.db import models
from phonenumber_field.modelfields import PhoneNumberField

from .enums import GenderChoices
from .utils import random_color_generator, random_nickname_generator

class Person(models.Model):
    first_name          = models.CharField(max_length=150, blank=True)
    last_name           = models.CharField(max_length=150, blank=True)
    email               = models.EmailField(unique=True)
    phone_number        = PhoneNumberField(unique=True)

    nickname            = models.CharField(max_length=150, default=random_nickname_generator)
    birth_date          = models.DateField(null=True)
    gender          = models.CharField(
        max_length=1,
        choices=GenderChoices.choices,
        default=GenderChoices.UNDEFINED
    )

    profile_image   = models.ImageField(null=True)
    default_color   = models.CharField(max_length=7, default=random_color_generator)

    @property
    def full_name(self):
        return f"{self.last_name}{self.first_name}"

    class Meta:
        db_table = 'person'
        indexes = [
            models.Index(fields=['phone_number']),
        ]
