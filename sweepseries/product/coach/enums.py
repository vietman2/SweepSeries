from django.db import models

class CareerChoices(models.IntegerChoices):
    UNDEFINED       = 0, '미지정'
    PROFESSIONAL    = 1, '프로선수 출신'
    UNIVERSITY      = 2, '대학선수 출신'
    HIGH_SCHOOL     = 3, '고교선수 출신'
    INDEPENDENT     = 4, '독립리그 출신'
    OVERSEAS        = 5, '해외대학 출신'
    TRAINING        = 6, '트레이닝 코치'
