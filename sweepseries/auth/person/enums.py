from django.db import models

class GenderChoices(models.TextChoices):
    UNDEFINED       = 'U', '미입력'
    MALE            = 'M', '남성'
    FEMALE          = 'F', '여성'
