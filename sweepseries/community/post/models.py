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

    class Meta:
        db_table = 'post'
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

    class Meta:
        db_table = 'post_report'

class PostLike(Like):
    post            = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')

    objects = models.Manager()

    class Meta:
        db_table = 'post_like'
        unique_together = ('post', 'user')

class PostContentView(models.Model):
    post            = models.ForeignKey(Post, on_delete=models.CASCADE)
    user            = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    viewed_first_at = models.DateTimeField(auto_now_add=True)
    viewed_last_at  = models.DateTimeField(auto_now=True)

    objects = models.Manager()

    class Meta:
        db_table = 'post_content_view'
        unique_together = ('post', 'user')
