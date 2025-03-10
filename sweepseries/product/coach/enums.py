from django.db import models

class CareerChoices(models.IntegerChoices):
    UNDEFINED       = 0, '미지정'
    PROFESSIONAL    = 1, '프로선수 출신'
    UNIVERSITY      = 2, '대학선수 출신'
    HIGH_SCHOOL     = 3, '고교선수 출신'
    INDEPENDENT     = 4, '독립리그 출신'
    OVERSEAS        = 5, '해외대학 출신'
    TRAINING        = 6, '트레이닝 코치'

class CoachApplicationStatus(models.IntegerChoices):
    PENDING     = 0, '대기중'
    APPROVED    = 1, '승인됨'
    REJECTED    = 2, '거절됨'

class DayChoices(models.IntegerChoices):
    MONDAY          = 0, '월요일'
    TUESDAY         = 1, '화요일'
    WEDNESDAY       = 2, '수요일'
    THURSDAY        = 3, '목요일'
    FRIDAY          = 4, '금요일'
    SATURDAY        = 5, '토요일'
    SUNDAY          = 6, '일요일'
