from django.db import models

class FacilityTypeChoices(models.IntegerChoices):
    CONVENIENCE = 1, '편의시설'
    EQUIPMENT   = 2, '구비장비'
    OTHERS      = 3, '기타'

class DayChoices(models.IntegerChoices):
    MONDAY          = 0, '월요일'
    TUESDAY         = 1, '화요일'
    WEDNESDAY       = 2, '수요일'
    THURSDAY        = 3, '목요일'
    FRIDAY          = 4, '금요일'
    SATURDAY        = 5, '토요일'
    SUNDAY          = 6, '일요일'
