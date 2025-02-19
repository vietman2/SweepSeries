from django.db import models

from auth.person.models import Person
from core.models import TimeStampedModel
from product.program.models import Curriculum

class Contract(TimeStampedModel):
    customer            = models.ForeignKey(
        Person, on_delete=models.CASCADE, related_name='contracts'
    )
    curriculum          = models.ForeignKey(
        Curriculum, on_delete=models.CASCADE, related_name='contracts'
    )

    completed_lessons   = models.PositiveSmallIntegerField(default=0)
    scheduled_lessons   = models.PositiveSmallIntegerField(default=0)

    objects             = models.Manager()

    class Meta:
        db_table = 'contract'
        ordering = ['-created_at']
