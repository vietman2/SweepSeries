from django.db import models

from .base import Academy
from ..enums import NoticeTypeChoices

class AcademyNotice(models.Model):
    academy     = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='notices')
    title       = models.CharField(max_length=100)
    content     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    type        = models.PositiveSmallIntegerField(
        choices=NoticeTypeChoices.choices, default=NoticeTypeChoices.NOTICE
    )

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_notice'
        verbose_name = '아카데미 공지사항'
        verbose_name_plural = '아카데미 공지사항'
        ordering = ['-created_at']

class AcademyNoticeAttachment(models.Model):
    notice      = models.ForeignKey(
        AcademyNotice, on_delete=models.CASCADE, related_name='attachments'
    )
    file        = models.FileField()
    uploaded_at = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'academy_notice_attachment'
        verbose_name = '아카데미 공지사항 첨부파일'
        verbose_name_plural = '아카데미 공지사항 첨부파일'
