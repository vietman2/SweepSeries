from django.db import models

from auth.userprofile.models import UserProfile
from community.models import Report, Like
from community.post.models import Post
from core.models import TimeStampedModel

class Comment(TimeStampedModel):
    post            = models.ForeignKey(
        Post,
        on_delete=models.DO_NOTHING,
        related_name='comments'
    )
    author          = models.ForeignKey(
        UserProfile,
        on_delete=models.DO_NOTHING,
        related_name='comments'
    )

    content         = models.TextField()

    is_deleted      = models.BooleanField(default=False)
    deleted_at      = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'comment'
        verbose_name = '댓글'
        verbose_name_plural = '댓글'
        ordering = ['created_at']

class ReComment(TimeStampedModel):
    comment         = models.ForeignKey(
        Comment,
        on_delete=models.DO_NOTHING,
        related_name='recomments'
    )
    author          = models.ForeignKey(
        UserProfile,
        on_delete=models.DO_NOTHING,
        related_name='recomments'
    )

    content         = models.TextField()

    is_deleted      = models.BooleanField(default=False)
    deleted_at      = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'recomment'
        verbose_name = '대댓글'
        verbose_name_plural = '대댓글'
        ordering = ['created_at']

class CommentReport(Report):
    comment         = models.ForeignKey(
        Comment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='comment_reports'
    )

    objects = models.Manager()

    def __str__(self):
        return f'댓글 신고 (댓글 {self.comment.id})'

    class Meta:
        db_table = 'comment_report'
        verbose_name = '댓글 신고'
        verbose_name_plural = '댓글 신고'

class ReCommentReport(Report):
    recomment       = models.ForeignKey(
        ReComment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='recomment_reports'
    )

    objects = models.Manager()

    def __str__(self):
        return f'대댓글 신고 (대댓글 {self.recomment.id})'

    class Meta:
        db_table = 'recomment_report'
        verbose_name = '대댓글 신고'
        verbose_name_plural = '대댓글 신고'

class CommentLike(Like):
    comment         = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='comment_likes'
    )

    objects = models.Manager()

    class Meta:
        db_table = 'comment_like'
        verbose_name = '댓글 좋아요'
        verbose_name_plural = '댓글 좋아요'
        unique_together = ('comment', 'user')

class ReCommentLike(Like):
    recomment       = models.ForeignKey(
        ReComment,
        on_delete=models.CASCADE,
        related_name='recomment_likes'
    )

    objects = models.Manager()

    class Meta:
        db_table = 'recomment_like'
        verbose_name = '대댓글 좋아요'
        verbose_name_plural = '대댓글 좋아요'
        unique_together = ('recomment', 'user')
