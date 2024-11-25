from django.db import models
from django.utils.timezone import now

from auth.user.models import User
from auth.userprofile.models import UserProfile
from core.models import TimeStampedModel
from .enums import ReportReason, ReviewStatus, ReportStatus

class Like(models.Model):
    user        = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='likes')

    liked_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

class Report(TimeStampedModel):
    report_user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    report_content      = models.TextField()
    report_reason       = models.CharField(
        max_length=2,
        choices=ReportReason.choices,
        default=ReportReason.OTHER
    )

    review_status       = models.IntegerField(
        choices=ReviewStatus.choices,
        default=ReviewStatus.SUBMITTED
    )
    report_status       = models.IntegerField(
        choices=ReportStatus.choices,
        default=ReportStatus.PENDING
    )
    feedback            = models.TextField(blank=True)

    class Meta:
        abstract = True

class CustomAutoField(models.PositiveBigIntegerField):
    def __init__(self, *args, **kwargs):
        kwargs['primary_key'] = True
        super().__init__(*args, **kwargs)

    def pre_save(self, model_instance, add):
        if add:
            date_prefix = now().strftime('%Y%m%d')
            max_id = model_instance.__class__.objects.all().order_by('-id').first()
            if max_id:
                ## check if the id is from today
                if str(max_id.id).startswith(date_prefix):
                    next_id = max_id.id + 1
                else:
                    next_id = int(date_prefix) * 100000000 + 1
            else:
                next_id = int(date_prefix) * 100000000 + 1

            setattr(model_instance, self.attname, next_id)

            return next_id

        ## if not add then update, delete
        return super().pre_save(model_instance, add)
