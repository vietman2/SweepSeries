from django.db import models

from core.models import TimeStampedModel
from auth.user.models import User

class Agreement(models.Model):
    title       = models.CharField(max_length=100)
    required    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    deleted     = models.BooleanField(default=False)
    deleted_at  = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'agreements'
        ordering = ['deleted', '-required']

class AgreementVersion(models.Model):
    agreement   = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name='versions')
    content     = models.TextField()
    summary     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    class Meta:
        db_table = 'agreement_versions'
        unique_together = ('agreement', 'created_at')
        ordering = ['-created_at']

class UserAgreement(TimeStampedModel):
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='agreements')
    agreement   = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name='users')
    agreed      = models.BooleanField(default=False)
    agreed_at   = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    class Meta:
        db_table = 'user_agreements'
        unique_together = ('user', 'agreement')
