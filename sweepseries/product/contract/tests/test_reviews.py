import json
from unittest.mock import patch
from rest_framework.test import APITestCase

from auth.user.models import User
from core.utils import generate_photo_file
from ..models import Contract

class ReviewsAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/initial/programs.json",
        "core/data/test/calendar.json", "core/data/test/programs.json",
        "core/data/initial/reviewtags.json", "core/data/test/contracts.json",
    ]

    def setUp(self):
        self.url = "/v1/reviews/"
        self.user = User.objects.get(username="normaluser")
        self.admin = User.objects.get(username="admin")
        self.review_data = {
            "rating": 5,
            "comment": "Good Lesson!!!",
            "tagIds": [1, 2, 3],
            "secure": True
        }
        self.negative_review_data = {
            "rating": 1,
            "comment": "Bad Lesson!!!",
            "tagIds": [10, 11, 12],
            "secure": False
        }
        self.data = {
            "session_id": 3,
            "lesson_review": json.dumps(self.review_data),
            "coach_review": json.dumps(self.negative_review_data),
            "academy_review": json.dumps(self.review_data),
        }

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

    def test_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['sessions']), 1)
        self.assertEqual(len(response.data['reviews']), 1)

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['sessions']), 0)
        self.assertEqual(len(response.data['reviews']), 0)

    def test_list_fail(self):
        ## JUST FOR COVERAGE
        ## Create a contract with no sessions to raise coverage
        Contract.objects.create(
            customer=self.admin.person,
            curriculum_id=1,
            completed_lessons=1,
            scheduled_lessons=1
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

    def test_tags_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}tags/")
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, data=self.data, format="multipart")
        self.assertEqual(response.status_code, 201)

    def test_create_no_tags(self):
        self.client.force_authenticate(user=self.user)
        no_tags_data = self.review_data.copy()
        no_tags_data["tagIds"] = []
        no_tags_negative_data = self.negative_review_data.copy()
        no_tags_negative_data["tagIds"] = []
        data = self.data.copy()
        data["lesson_review"] = json.dumps(no_tags_data)
        data["coach_review"] = json.dumps(no_tags_negative_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 201)

    @patch("django.core.files.storage.default_storage.save")
    def test_create_with_images(self, mock_save):
        mock_save.return_value = "reviews/test.jpg"
        image1 = generate_photo_file()
        image2 = generate_photo_file()
        image3 = generate_photo_file()
        image4 = generate_photo_file()
        self.client.force_authenticate(user=self.user)

        data = self.data.copy()
        data["lesson_images"] = [image1]
        data["coach_images"] = [image2]
        data["academy_images"] = [image3, image4]
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. no session
        self.client.force_authenticate(user=self.user)
        data = self.data.copy()
        data["session_id"] = 100
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 2. already reviewed
        self.client.force_authenticate(user=self.user)
        data = self.data.copy()
        data["session_id"] = 2
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 3. no auth
        self.client.force_authenticate(user=self.user)
        data = self.data.copy()
        data["session_id"] = 1
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 4. bad rating
        bad_rating_data = self.review_data.copy()
        bad_rating_data["rating"] = 6
        data = self.data.copy()
        data["lesson_review"] = json.dumps(bad_rating_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 5. bad comment
        bad_comment_data = self.review_data.copy()
        bad_comment_data["comment"] = "a"
        data = self.data.copy()
        data["lesson_review"] = json.dumps(bad_comment_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_create_fail_tags(self):
        self.client.force_authenticate(user=self.user)

        ## 1. bad tags (DNE)
        bad_tags_data = self.review_data.copy()
        bad_tags_data["tagIds"] = [20, 21]
        data = self.data.copy()
        data["lesson_review"] = json.dumps(bad_tags_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 2. bad tags (high ratings, but negative tags)
        bad_tags_data = self.review_data.copy()
        bad_tags_data["tagIds"] = [10, 11]
        data = self.data.copy()
        data["lesson_review"] = json.dumps(bad_tags_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 3. bad tags (low ratings, but positive tags)
        bad_tags_data = self.review_data.copy()
        bad_tags_data["rating"] = 1
        data = self.data.copy()
        data["lesson_review"] = json.dumps(bad_tags_data)
        response = self.client.post(self.url, data=data, format="multipart")
        self.assertEqual(response.status_code, 400)
