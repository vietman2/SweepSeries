from django.db import models

from auth.user.models import User
from core.models import TimeStampedModel

class Inquiry(TimeStampedModel):
    title       = models.CharField(max_length=255)
    description = models.TextField()
    reply       = models.TextField(blank=True, null=True)

    user        = models.ForeignKey(User, on_delete=models.CASCADE)

    resolved    = models.BooleanField(default=False)
    replied     = models.BooleanField(default=False)

    objects     = models.Manager()

    class Meta:
        db_table = 'inquiries'
