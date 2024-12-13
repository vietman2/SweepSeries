import json
from unittest.mock import patch
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

    def test_unallowed_methods(self):
        response = self.client.patch(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

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

    def test_coach_list_admin(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': '승인 거부'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 대기'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 완료'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

    def test_coach_list_normal(self):
        self.client.force_authenticate(user=User.objects.get(username="normaluser"))
        param = {'academy': '123e4567-e89b-12d3-a456-426614174999', }
        response = self.client.get(self.url, param)
        self.assertEqual(response.status_code, 200)

    def test_coach_list_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': 'invalid'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 400)

        self.client.force_authenticate(user=User.objects.get(username="normaluser"))
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

    def test_coach_detail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.get(f"{self.url}923e4567-e89b-12d3-a456-426614174999/")
        self.assertEqual(response.status_code, 200)

    def test_me(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}me/")
        self.assertEqual(response.status_code, 200)

    def test_me_fail(self):
        ## 1. user has no coach
        self.client.force_authenticate(user=self.user2)
        response = self.client.get(f"{self.url}me/")
        self.assertEqual(response.status_code, 404)

    def test_coach_approve(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/approve/")
        self.assertEqual(response.status_code, 200)

    def test_coach_reject(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/reject/", {
            "reject_reason": "이유"
        })
        self.assertEqual(response.status_code, 200)

    def test_coach_reject_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/reject/")
        self.assertEqual(response.status_code, 400)

    def test_accept_coach(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/accept/")
        self.assertEqual(response.status_code, 200)

    def test_accept_coach_fail(self):
        self.client.force_authenticate(self.user2)
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/accept/")
        self.assertEqual(response.status_code, 403)

    def test_deny_coach(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/deny/")
        self.assertEqual(response.status_code, 200)

    def test_deny_coach_fail(self):
        self.client.force_authenticate(self.user2)
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/deny/")
        self.assertEqual(response.status_code, 403)

    def test_update_introduction(self):
        uuid = "923e4567-e89b-12d3-a456-426614174999"
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/introduction/", {
            "introduction": "안녕하세요"
        })
        self.assertEqual(response.status_code, 200)

    def test_update_introduction_fail(self):
        ## 1. no data
        uuid = "923e4567-e89b-12d3-a456-426614174999"
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/introduction/")
        self.assertEqual(response.status_code, 400)

        ## 2. no auth
        self.client.force_authenticate(self.user2)
        response = self.client.patch(f"{self.url}{uuid}/introduction/", {
            "introduction": "안녕하세요"
        })
        self.assertEqual(response.status_code, 403)

    def test_update_sns(self):
        uuid = "923e4567-e89b-12d3-a456-426614174999"
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/sns/", {
            "instagram": "https://www.instagram.com/test", 
            "blog": "https://www.blog.com/test"
        })
        self.assertEqual(response.status_code, 200)

    def test_update_sns_fail(self):
        ## 1. no data
        uuid = "923e4567-e89b-12d3-a456-426614174999"
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/sns/")
        self.assertEqual(response.status_code, 400)

        ## 2. invalid instagram url (no user id)
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/sns/", {
            "instagram": "https://www.instagram.com", 
            "blog": "https://www.blog.com/test"
        })
        self.assertEqual(response.status_code, 400)

        ## 3. invalid instagram url (invalid domain)
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/sns/", {
            "instagram": "https://www.instagram.co.kr/test", 
            "blog": "https://www.blog.com/test"
        })
        self.assertEqual(response.status_code, 400)

        ## 3. invalid instagram url (invalid user id)
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{uuid}/sns/", {
            "instagram": "https://www.instagram.com/!@#$%^&*", 
            "blog": "https://www.blog.com/test"
        })
