from django.db.models import Q
from rest_framework import serializers

from product.academy.models import Academy
from .review import BaseReviewSerializer
from .tags import AcademyReviewTagSerializer
from ..models import Review

class AcademyReviewSerializer(BaseReviewSerializer):
    def get_rating(self, obj):
        return obj.academy_rating

    def get_comment(self, obj):
        return obj.academy_comment

    def get_tags(self, obj):
        tags = obj.academy_tags.all()
        return AcademyReviewTagSerializer(tags, many=True).data

    def get_images(self, obj):
        return [image.image.url for image in obj.academy_images.all()]

class AcademyReviewSummarySerializer(serializers.ModelSerializer):
    average_rating  = serializers.SerializerMethodField()
    summary         = serializers.SerializerMethodField()

    class Meta:
        model = Academy
        fields = ["uuid", "average_rating", "summary"]

    def get_average_rating(self, obj):
        return obj.cached_rating

    def get_summary(self, obj):
        q = Q(contract__curriculum__program__academy=obj)

        reviews = Review.objects.filter(q)

        rating_5 = reviews.filter(academy_rating=5).count()
        rating_4 = reviews.filter(academy_rating=4).count()
        rating_3 = reviews.filter(academy_rating=3).count()
        rating_2 = reviews.filter(academy_rating=2).count()
        rating_1 = reviews.filter(academy_rating=1).count()

        return {
            "rating_5": rating_5,
            "rating_4": rating_4,
            "rating_3": rating_3,
            "rating_2": rating_2,
            "rating_1": rating_1,
            "total": reviews.count()
        }
