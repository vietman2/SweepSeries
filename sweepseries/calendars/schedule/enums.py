from django.db import models

class RepeatTypeChoices(models.TextChoices):
    NO_REPEAT   = 'N', '반복 없음'
    DAILY       = 'D', '매일'
    WEEKLY      = 'W', '매주'
    MONTHLY     = 'M', '매월'
    YEARLY      = 'Y', '매년'
