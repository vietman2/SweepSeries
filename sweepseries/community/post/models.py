from django.db import models

from auth.userprofile.models import UserProfile
from community.enums import ForumChoices
from community.models import Report, Like, CustomAutoField
from core.models import TimeStampedModel

class Image(TimeStampedModel):
    image           = models.FileField(null=True)

    is_deleted      = models.BooleanField(default=False)
    deleted_at      = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'post_image'
        verbose_name = '게시물 이미지'
        verbose_name_plural = '게시물 이미지'

class Post(TimeStampedModel):
    id              = CustomAutoField()
    forum           = models.IntegerField(choices=ForumChoices.choices)
    author          = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    tag             = models.ForeignKey('tag.Tag', on_delete=models.SET_NULL, null=True)
    title           = models.CharField(max_length=40)
    content         = models.TextField()

    images          = models.ManyToManyField(Image, blank=True)

    num_views       = models.IntegerField(default=0)
    is_under_review = models.BooleanField(default=False)

    is_deleted      = models.BooleanField(default=False)
    deleted_at      = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    def __str__(self):
        forum_displayname = ForumChoices(self.forum).label
        return f"[{forum_displayname}] {self.title}"

    class Meta:
        db_table = 'post'
        verbose_name = '게시물'
        verbose_name_plural = '게시물'
        ordering = ['-created_at']
        unique_together = ('forum', 'author', 'title')

class PostReport(Report):
    post            = models.ForeignKey(
        Post,
        on_delete=models.SET_NULL,
        null=True,
        related_name='post_reports'
    )

    objects = models.Manager()

    def __str__(self):
        title = self.post.title if self.post else '삭제된 게시물'
        return f"신고된 게시물: {title}"

    class Meta:
        db_table = 'post_report'
        verbose_name = '게시물 신고'
        verbose_name_plural = '게시물 신고'

class PostLike(Like):
    post            = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')

    objects = models.Manager()

    class Meta:
        db_table = 'post_like'
        verbose_name = '게시물 좋아요'
        verbose_name_plural = '게시물 좋아요'
        unique_together = ('post', 'user')

class PostContentView(models.Model):
    post            = models.ForeignKey(Post, on_delete=models.CASCADE)
    user            = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    viewed_first_at = models.DateTimeField(auto_now_add=True)
    viewed_last_at  = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    class Meta:
        db_table = 'post_content_view'
        verbose_name = '게시물 조회'
        verbose_name_plural = '게시물 조회'
        unique_together = ('post', 'user')
