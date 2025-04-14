import json
from django.conf import settings
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

    def test_coach_list_normal(self):
        ## by academy
        self.client.force_authenticate(user=self.user)
        param = {'academy': '123e4567-e89b-12d3-a456-426614174999', }
        response = self.client.get(self.url, param)
        self.assertEqual(response.status_code, 200)

    def test_coach_list_fail(self):
        self.client.force_authenticate(user=self.user2)
        param = {'status': 'invalid'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 400)

        ## no auth
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

    def test_coach_detail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.get(f"{self.url}923e4567-e89b-12d3-a456-426614174999/")
        self.assertEqual(response.status_code, 200)
