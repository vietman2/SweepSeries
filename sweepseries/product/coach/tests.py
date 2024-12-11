import json
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

class CoachTestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/coaches/"
        self.user = User.objects.get(username="normaluser")
        self.user2 = User.objects.get(username="admin")
        test_image1 = SimpleUploadedFile(
            "test1.png", b"file_content", content_type="image/png"
        )
        professions = ["투수 전문", "타격 전문", "수비 전문", "포수 전문", "트레이닝 전문", "재활 전문", "기타"]
        self.create_data = {
            "career": "프로선수 출신",
            "academy": "123e4567-e89b-12d3-a456-426614174999",
            "profile_image": test_image1,
            "professions": json.dumps(professions)
        }

    @patch('django.core.files.storage.default_storage.save')
    def test_create_coach(self, mock_save):
        self.client.force_authenticate(user=self.user2)
        mock_save.return_value = 'test.png'
        response = self.client.post(self.url, self.create_data, format='multipart')
        self.assertEqual(response.status_code, 201)

    @patch('django.core.files.storage.default_storage.save')
    def test_create_coach_2(self, mock_save):
        ## with undefined career and no profession
        self.client.force_authenticate(user=self.user2)
        data = self.create_data.copy()
        data['career'] = "프로선수"
        data['professions'] = json.dumps([])
        mock_save.return_value = 'test.png'
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, 201)

    def test_create_coach_fail(self):
        ## 1. no academy
        self.client.force_authenticate(user=self.user2)
        data = self.create_data.copy()
        data['academy'] = "523e4567-e89b-12d3-a456-426614174998"
        response = self.client.post(self.url, data, format='multipart')
        self.assertEqual(response.status_code, 400)
