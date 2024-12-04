from django.db import models

class FAQCategoryChoices(models.IntegerChoices):
    RESERVATIONS    = 1, '예약'
    EVENTS          = 2, '이벤트'
    ACADEMY         = 3, '아카데미'
    LESSONS         = 4, '레슨'
    PROMODE         = 5, '프로모드'
    OTHERS          = 6, '기타'
