from django.db import models

class FacilityTypeChoices(models.IntegerChoices):
    CONVENIENCE = 1, '편의시설'
    EQUIPMENT   = 2, '장비'
    OTHERS      = 3, '기타'
