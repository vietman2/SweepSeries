from rest_framework import serializers

from ..models import Tag, LessonReviewTags, CoachReviewTags, AcademyReviewTags

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'tag']
        ## abstract = True

class LessonReviewTagSerializer(TagSerializer):
    class Meta(TagSerializer.Meta):
        model = LessonReviewTags

class CoachReviewTagSerializer(TagSerializer):
    class Meta(TagSerializer.Meta):
        model = CoachReviewTags

class AcademyReviewTagSerializer(TagSerializer):
    class Meta(TagSerializer.Meta):
        model = AcademyReviewTags
