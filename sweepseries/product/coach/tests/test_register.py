import json
from unittest.mock import patch, MagicMock
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

class CoachRegisterTestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/users.json",
        "core/data/initial/regions.json", "core/data/test/academies.json",
        "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/coaches/"
        self.user = User.objects.get(username="admin")
        test_image1 = SimpleUploadedFile(
            "test1.png", b"file_content", content_type="image/png"
        )
        test_image2 = SimpleUploadedFile(
            "test2.jpg", b"file_content", content_type="image/jpeg"
        )
        professions = ["투수 전문", "타격 전문", "수비 전문", "포수 전문", "트레이닝 전문", "재활 전문", "기타"]
        self.create_data = {
            "career": "프로선수 출신",
            "academy": "123e4567-e89b-12d3-a456-426614174999",
            "certificate": test_image2,
            "profile_image": test_image1,
            "professions": json.dumps(professions)
        }

    @patch('product.coach.utils.default_storage')
    @patch('django.core.files.storage.default_storage.save')
    def test_create_coach(self, mock_save, mock_default_storage):
        mock_save.return_value = 'test.png'
        mock_s3_client = MagicMock()
        mock_default_storage.connection.meta.client = mock_s3_client

        fake_bucket = MagicMock()
        fake_bucket.name = "test-bucket"
        mock_default_storage.bucket = fake_bucket

        expected_path = f"users/{self.user.uuid}/profiles/test1.jpg"
        fake_url = f"https://test.com/{expected_path}"
        mock_default_storage.url.return_value = fake_url

        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.create_data, format='multipart')
        self.assertEqual(response.status_code, 201)

    @patch('product.coach.utils.default_storage')
    @patch('django.core.files.storage.default_storage.save')
    def test_create_coach_2(self, mock_save, mock_default_storage):
        mock_s3_client = MagicMock()
        mock_default_storage.connection.meta.client = mock_s3_client

        fake_bucket = MagicMock()
        fake_bucket.name = "test-bucket"
        mock_default_storage.bucket = fake_bucket

        expected_path = f"users/{self.user.uuid}/profiles/test1.jpg"
        fake_url = f"https://test.com/{expected_path}"
        mock_default_storage.url.return_value = fake_url

        ## with undefined career and no profession
        self.client.force_authenticate(user=self.user)
        data = self.create_data.copy()
        data['career'] = "프로선수"
        data['professions'] = json.dumps([])
        mock_save.return_value = 'test.png'
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, 201)

    def test_create_coach_fail(self):
        ## 1. no academy
        self.client.force_authenticate(user=self.user)
        data = self.create_data.copy()
        data['academy'] = "523e4567-e89b-12d3-a456-426614174998"
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, 400)
