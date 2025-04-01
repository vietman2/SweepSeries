from .review import BaseReviewSerializer
from .tags import CoachReviewTagSerializer

class CoachReviewSerializer(BaseReviewSerializer):
    def get_rating(self, obj):
        return obj.coach_rating

    def get_comment(self, obj):
        return obj.coach_comment

    def get_tags(self, obj):
        tags = obj.coach_tags.all()
        return CoachReviewTagSerializer(tags, many=True).data

    def get_images(self, obj):
        return [image.image.url for image in obj.coach_images.all()]
