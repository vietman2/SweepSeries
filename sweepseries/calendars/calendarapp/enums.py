from django.db import models

class ColorChoices(models.TextChoices):
    RED         = '#FF6B6B', '빨강'
    ORANGE      = '#FFA07A', '주황'
    GREEN       = '#98FB98', '초록'
    CYAN        = '#B0E0E6', '청록'
    YELLOW      = '#FFD700', '노랑'
    LAVENDER    = '#E6E6FA', '보라'
    BLUE        = '#87CEEB', '파랑'
    PURPLE      = '#D8BFD8', '보라'

class AuthChoices(models.IntegerChoices):
    OWNER   = 1, '소유자'
    EDITOR  = 2, '편집자'
    VIEWER  = 3, '뷰어'
