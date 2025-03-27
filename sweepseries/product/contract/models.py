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

class Tag(models.Model):
    tag         = models.CharField(max_length=50)
    is_positive = models.BooleanField(default=True)

    objects = models.Manager()

    class Meta:
        abstract = True

class LessonReviewTags(Tag):
    class Meta:
        db_table = 'lesson_review_tags'

class CoachReviewTags(Tag):
    class Meta:
        db_table = 'coach_review_tags'

class AcademyReviewTags(Tag):
    class Meta:
        db_table = 'academy_review_tags'

class ReviewImage(TimeStampedModel):
    image   = models.ImageField(upload_to="reviews/")

    objects = models.Manager()

    class Meta:
        db_table = 'review_image'

class Review(TimeStampedModel):
    contract        = models.OneToOneField(
        Contract, on_delete=models.CASCADE, related_name='review'
    )
    lesson_rating   = models.PositiveSmallIntegerField()
    lesson_comment  = models.CharField(max_length=500)
    lesson_tags     = models.ManyToManyField(
        LessonReviewTags, related_name='lesson_reviews'
    )
    lesson_images   = models.ManyToManyField(
        ReviewImage, related_name='lesson_reviews'
    )

    coach_rating    = models.PositiveSmallIntegerField()
    coach_comment   = models.CharField(max_length=500)
    secure_coach    = models.BooleanField(default=False)
    coach_tags      = models.ManyToManyField(
        CoachReviewTags, related_name='coach_reviews'
    )
    coach_images    = models.ManyToManyField(
        ReviewImage, related_name='coach_reviews'
    )

    academy_rating  = models.PositiveSmallIntegerField()
    academy_comment = models.CharField(max_length=500)
    secure_academy  = models.BooleanField(default=False)
    academy_tags    = models.ManyToManyField(
        AcademyReviewTags, related_name='academy_reviews'
    )
    academy_images  = models.ManyToManyField(
        ReviewImage, related_name='academy_reviews'
    )

    objects         = models.Manager()

    class Meta:
        db_table = 'review'
        ordering = ['-created_at']
