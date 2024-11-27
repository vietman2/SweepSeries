from django.db import models

class ForumChoices(models.IntegerChoices):
    DUGOUT  = 1, "덕아웃"
    RECRUIT = 2, "드래프트"
    MARKET  = 3, "마켓"
    STEAL   = 4, "스틸"

class ReportReason(models.TextChoices):
    INSULT          = 'IN', '욕설/비방'
    VIOLENCE        = 'VI', '폭력/협박/위협'
    PORN            = 'PO', '음란물'
    UNTRUTHFUL      = 'UN', '거짓/허위정보'
    AD              = 'AD', '도배/스팸/광고'
    PERSONAL_INFO   = 'PI', '개인정보 침해'
    POLITICAL       = 'PL', '정치적인 내용'
    WRONG_CATEGORY  = 'WC', '잘못된 게시판/태그'
    OTHER           = 'OT', '기타'

class ReportStatus(models.IntegerChoices):
    SUBMITTED       = 0, '제출됨'
    UNDER_REVIEW    = 1, '검토중'
    REVIEWED        = 2, '검토 완료'
