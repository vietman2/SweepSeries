from django.db import models

class AuthChoices(models.IntegerChoices):
    OWNER   = 1, '소유자'
    EDITOR  = 2, '편집자'
    VIEWER  = 3, '뷰어'
