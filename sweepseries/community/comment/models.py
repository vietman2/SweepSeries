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
        ordering = ['created_at']

class CommentReport(Report):
    comment         = models.ForeignKey(
        Comment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='comment_reports'
    )

    class Meta:
        db_table = 'comment_report'

class ReCommentReport(Report):
    recomment       = models.ForeignKey(
        ReComment,
        on_delete=models.SET_NULL,
        null=True,
        related_name='recomment_reports'
    )

    class Meta:
        db_table = 'recomment_report'

class CommentLike(Like):
    comment         = models.ForeignKey(
        Comment,
        on_delete=models.CASCADE,
        related_name='comment_likes'
    )

    objects = models.Manager()

    class Meta:
        db_table = 'comment_like'
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
        unique_together = ('recomment', 'user')
