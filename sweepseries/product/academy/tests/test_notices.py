from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

class AcademyNoticeTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/123e4567-e89b-12d3-a456-426614174999/notices/"
        self.user = User.objects.get(username="normaluser")

    def test_academy_notice_list(self):
        response = self.client.get(f"{self.url}")
        self.assertEqual(response.status_code, 200)

    def test_academy_notice_detail(self):
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    @patch('django.core.files.storage.default_storage.save')
    def test_academy_notice_create(self, mock_save):
        self.client.force_authenticate(user=self.user)
        ## 1. normal notice + no image
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "공지",
        })
        self.assertEqual(response.status_code, 201)

        ## 2. event + image
        test_image = SimpleUploadedFile(
            "test.png", b"file_content", content_type="image/png"
        )
        mock_save.return_value = 'test.png'
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "이벤트",
            "image": test_image,
        })
        self.assertEqual(response.status_code, 201)

        # 3. other + no image
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "기타",
        })
        self.assertEqual(response.status_code, 201)

    def test_academy_notice_create_fail(self):
        ## 1. empty data
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"{self.url}", {
            "title": "",
            "content": "",
        })
        self.assertEqual(response.status_code, 400)

        ## 2. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
        })
        self.assertEqual(response.status_code, 403)

        ## 3. invalid type
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"{self.url}", {
            "title": "제목",
            "content": "내용",
            "type": "테스트",
        })
        self.assertEqual(response.status_code, 400)

    def test_academy_notice_update(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/", {
            "title": "제목",
            "content": "내용",
        })
        self.assertEqual(response.status_code, 200)

    def test_academy_notice_update_fail(self):
        ## 1. empty data
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/", {
            "title": "",
            "content": "",
        })
        self.assertEqual(response.status_code, 400)

        ## 2. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.patch(f"{self.url}1/", {
            "title": "제목",
            "content": "내용",
        })
        self.assertEqual(response.status_code, 403)

    def test_academy_notice_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 204)

    def test_academy_notice_delete_fail(self):
        ## 1. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 403)

        ## 2. not found
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"{self.url}999/")
        self.assertEqual(response.status_code, 404)
