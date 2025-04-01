from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import atomic
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from auth.person.serializers import StudentSimpleSerializer
from product.lesson.models import Session
from ..models import Review, ReviewImage, LessonReviewTags, CoachReviewTags, AcademyReviewTags

class ReviewSerializer(serializers.ModelSerializer):
    session_id     = serializers.IntegerField(write_only=True)
    lesson_review   = serializers.JSONField(write_only=True)
    coach_review    = serializers.JSONField(write_only=True)
    academy_review  = serializers.JSONField(write_only=True)
    lesson_images   = serializers.ListField(write_only=True, required=False)
    coach_images    = serializers.ListField(write_only=True, required=False)
    academy_images  = serializers.ListField(write_only=True, required=False)

    class Meta:
        model = Review
        fields = [
            'session_id', 'lesson_review', 'coach_review', 'academy_review',
            'lesson_images', 'coach_images', 'academy_images'
        ]
        read_only_fields = [
            'contract',
            'lesson_rating', 'lesson_comment', 'lesson_tags',
            'coach_rating', 'coach_comment', 'coach_tags', 'secure_coach',
            'academy_rating', 'academy_comment', 'academy_tags', 'secure_academy',
        ]

    def validate_session(self, session_id):
        try:
            session = Session.objects.get(id=session_id)
        except ObjectDoesNotExist as e:
            raise ValidationError("해당 세션을 찾을 수 없습니다.") from e

        user = self.context['user']

        if session.contract.customer != user.person:
            raise ValidationError("해당 세션에 대한 권한이 없습니다.")

        ## 이미 리뷰가 존재하면 에러 발생
        if Review.objects.filter(contract=session.contract).exists():
            raise ValidationError("이미 리뷰를 작성하셨습니다.")

        return session.contract

    def validate_review_data(self, rating, comment):
        ## validate ratings
        if rating < 1 or rating > 5:
            raise serializers.ValidationError("평점은 1 ~ 5 사이어야 합니다.")

        ## validate comments
        if len(comment) < 10 or len(comment) > 500:
            raise serializers.ValidationError("리뷰는 10자 이상 500자 이하로 작성해주세요.")

    def validate_tags(self, rating, tags, tag_ids):
        if len(tag_ids) != len(tags):
            raise serializers.ValidationError("태그가 올바르지 않습니다.")

        if rating < 3:
            for tag in tags:
                if tag.is_positive:
                    raise serializers.ValidationError("태그가 올바르지 않습니다.")
        else:
            for tag in tags:
                if not tag.is_positive:
                    raise serializers.ValidationError("태그가 올바르지 않습니다.")

    def validate_lesson(self, value):
        ## validate rating and comment
        rating = value['rating']
        comment = value['comment']
        self.validate_review_data(rating, comment)

        ## validate tags
        tag_ids = value['tagIds']
        tags = LessonReviewTags.objects.filter(id__in=tag_ids)
        self.validate_tags(rating, tags, tag_ids)

        return {
            'lesson_rating': rating,
            'lesson_comment': comment,
            'lesson_tags': tags,
        }

    def validate_coach(self, value):
        ## validate rating and comment
        rating = value['rating']
        comment = value['comment']
        self.validate_review_data(rating, comment)

        ## validate tags
        tag_ids = value['tagIds']
        tags = CoachReviewTags.objects.filter(id__in=tag_ids)
        self.validate_tags(rating, tags, tag_ids)

        return {
            'coach_rating': rating,
            'coach_comment': comment,
            'coach_tags': tags,
            'secure_coach': value['secure'],
        }

    def validate_academy(self, value):
        ## validate rating and comment
        rating = value['rating']
        comment = value['comment']
        self.validate_review_data(rating, comment)

        ## validate tags
        tag_ids = value['tagIds']
        tags = AcademyReviewTags.objects.filter(id__in=tag_ids)
        self.validate_tags(rating, tags, tag_ids)

        return {
            'academy_rating': rating,
            'academy_comment': comment,
            'academy_tags': tags,
            'secure_academy': value['secure'],
        }

    def validate(self, attrs):
        contract = self.validate_session(attrs.pop('session_id'))
        attrs['contract'] = contract

        lesson_review = attrs.pop('lesson_review')
        coach_review = attrs.pop('coach_review')
        academy_review = attrs.pop('academy_review')

        lesson_data = self.validate_lesson(lesson_review)
        attrs['lesson_rating'] = lesson_data['lesson_rating']
        attrs['lesson_comment'] = lesson_data['lesson_comment']
        attrs['lesson_tags'] = lesson_data['lesson_tags']

        coach_data = self.validate_coach(coach_review)
        attrs['coach_rating'] = coach_data['coach_rating']
        attrs['coach_comment'] = coach_data['coach_comment']
        attrs['coach_tags'] = coach_data['coach_tags']
        attrs['secure_coach'] = coach_data['secure_coach']

        academy_data = self.validate_academy(academy_review)
        attrs['academy_rating'] = academy_data['academy_rating']
        attrs['academy_comment'] = academy_data['academy_comment']
        attrs['academy_tags'] = academy_data['academy_tags']
        attrs['secure_academy'] = academy_data['secure_academy']

        return attrs

    def create(self, validated_data):
        lesson_tags = validated_data.pop('lesson_tags')
        coach_tags = validated_data.pop('coach_tags')
        academy_tags = validated_data.pop('academy_tags')

        lesson_images = validated_data.pop('lesson_images', [])
        coach_images = validated_data.pop('coach_images', [])
        academy_images = validated_data.pop('academy_images', [])

        with atomic():
            new_review = Review.objects.create(
                **validated_data
            )

            new_review.lesson_tags.set(lesson_tags)
            new_review.coach_tags.set(coach_tags)
            new_review.academy_tags.set(academy_tags)

            for image in lesson_images:
                saved_image = ReviewImage.objects.create(image=image)
                saved_image.save()
                new_review.lesson_images.add(saved_image)

            for image in coach_images:
                saved_image = ReviewImage.objects.create(image=image)
                saved_image.save()
                new_review.coach_images.add(saved_image)

            for image in academy_images:
                saved_image = ReviewImage.objects.create(image=image)
                saved_image.save()
                new_review.academy_images.add(saved_image)

            new_review.save()

        return new_review

class BaseReviewSerializer(serializers.ModelSerializer):
    reviewer    = serializers.SerializerMethodField()
    created_at  = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)
    rating      = serializers.SerializerMethodField()
    comment     = serializers.SerializerMethodField()
    tags        = serializers.SerializerMethodField()
    images      = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            'id', 'reviewer', 'created_at', 'rating',
            'comment', 'tags', 'images',
        ]

    def get_reviewer(self, obj):
        reviewer = obj.contract.customer
        return StudentSimpleSerializer(reviewer).data
