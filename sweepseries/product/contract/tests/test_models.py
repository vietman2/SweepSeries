from django.test import TestCase

from ..models import CoachReviewTags, LessonReviewTags, AcademyReviewTags

class TagModelsTestCase(TestCase):
    fixtures = ["core/data/initial/reviewtags.json"]

    def test_coach_review_tags_str(self):
        tag_pos = CoachReviewTags.objects.get(id=1)
        self.assertEqual(str(tag_pos), "[코치 리뷰] 전문성이 뛰어나요 +")

        tag_neg = CoachReviewTags.objects.get(id=9)
        self.assertEqual(str(tag_neg), "[코치 리뷰] 전문성이 부족해요 -")

    def test_lesson_review_tags_str(self):
        tag_pos = LessonReviewTags.objects.get(id=1)
        self.assertEqual(str(tag_pos), "[레슨 리뷰] 체계적으로 진행돼요 +")

        tag_neg = LessonReviewTags.objects.get(id=9)
        self.assertEqual(str(tag_neg), "[레슨 리뷰] 체계적이지 않아요 -")

    def test_academy_review_tags_str(self):
        tag_pos = AcademyReviewTags.objects.get(id=1)
        self.assertEqual(str(tag_pos), "[아카데미 리뷰] 시설이 깔끔해요 +")

        tag_neg = AcademyReviewTags.objects.get(id=10)
        self.assertEqual(str(tag_neg), "[아카데미 리뷰] 시설이 낡았어요 -")
