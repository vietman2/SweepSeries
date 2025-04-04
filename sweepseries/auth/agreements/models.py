from django.db import models

class Agreement(models.Model):
    title       = models.CharField(max_length=100)
    required    = models.BooleanField(default=False)
    created_at  = models.DateTimeField(auto_now_add=True)
    deleted     = models.BooleanField(default=False)
    deleted_at  = models.DateTimeField(null=True, blank=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.title}"

    class Meta:
        db_table = 'agreements'
        verbose_name = '약관'
        verbose_name_plural = '약관'
        ordering = ['deleted', '-required']

class AgreementVersion(models.Model):
    agreement   = models.ForeignKey(Agreement, on_delete=models.CASCADE, related_name='versions')
    content     = models.TextField()
    summary     = models.TextField()
    created_at  = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    def __str__(self):
        return f"{self.agreement} - {self.created_at.strftime('%Y-%m-%d')}"

    class Meta:
        db_table = 'agreement_versions'
        verbose_name = '약관 버전'
        verbose_name_plural = '약관 버전'
        unique_together = ('agreement', 'created_at')
        ordering = ['-created_at']
