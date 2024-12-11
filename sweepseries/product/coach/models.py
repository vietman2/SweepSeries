import uuid
from django.db import models

from auth.person.models import Person
from auth.user.models import User
from product.academy.models import Academy
from .enums import CareerChoices

class CoachProfession(models.Model):
    profession      = models.CharField(max_length=20, unique=True)
    kor_name        = models.CharField(max_length=20, unique=True)

    objects         = models.Manager()

    class Meta:
        db_table = 'coach_profession'

class Coach(models.Model):
    uuid            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    person          = models.OneToOneField(Person, on_delete=models.CASCADE, related_name='coach')
    academy         = models.ForeignKey(Academy, on_delete=models.CASCADE, related_name='coaches')

    introduction    = models.TextField()
    profile_image   = models.ImageField()
    career          = models.IntegerField(choices=CareerChoices.choices, default=CareerChoices.UNDEFINED)
    professions     = models.ManyToManyField(CoachProfession, related_name='coaches')

    is_verified     = models.BooleanField(default=False)
    verified_at     = models.DateTimeField(null=True)
    is_rejected     = models.BooleanField(default=False)
    reject_reason   = models.TextField(blank=True)

    objects         = models.Manager()

    class Meta:
        db_table = 'coach'

class CoachLike(models.Model):
    coach       = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='likes')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='liked_coaches')

    liked_at    = models.DateTimeField(auto_now_add=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'coach_like'

class CoachReview(models.Model):
    coach       = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='reviews')
    user        = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')

    rating      = models.PositiveSmallIntegerField()
    content     = models.TextField()

    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    objects     = models.Manager()

    class Meta:
        db_table = 'coach_review'
