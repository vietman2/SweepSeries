from django.db import models

from core.models import TimeStampedModel
from auth.user.models import User

class Agreement(TimeStampedModel):
    title       = models.CharField(max_length=100)
    content     = models.TextField()
    required    = models.BooleanField(default=False)

    objects = models.Manager()

    class Meta:
        db_table = 'agreements'

class UserAgreement(TimeStampedModel):
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agreements')
    agreement   = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name='users')
    agreed      = models.BooleanField(default=False)

    objects = models.Manager()

    class Meta:
        db_table = 'user_agreements'
        unique_together = ('user', 'agreement')
