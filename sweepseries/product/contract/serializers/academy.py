from core.utils import get_presigned_url
from .review import BaseReviewSerializer
from .tags import AcademyReviewTagSerializer

class AcademyReviewSerializer(BaseReviewSerializer):
    def get_rating(self, obj):
        return obj.academy_rating

    def get_comment(self, obj):
        return obj.academy_comment

    def get_tags(self, obj):
        tags = obj.academy_tags.all()
        return AcademyReviewTagSerializer(tags, many=True).data

    def get_images(self, obj):
        return [get_presigned_url(image.image) for image in obj.academy_images.all()]
