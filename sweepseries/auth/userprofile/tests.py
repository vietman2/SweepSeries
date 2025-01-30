from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

class UserProfileAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/profiles/"
        self.user = User.objects.get(username="normaluser")
        self.update_data = {
            "nickname": "testuser",
            "introduction": "안녕하세요!",
            "birthdate": "1999-01-01",
        }

    def test_update_profile(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.patch(f"{self.url}2/", self.update_data)
        self.assertEqual(response.status_code, 200)

    def test_update_profile_fail(self):
        self.client.force_authenticate(user=self.user)

        ## 1. not self user
        response = self.client.patch(f"{self.url}1/", self.update_data)
        self.assertEqual(response.status_code, 403)

        ## 2. invalid data
        data = self.update_data.copy()
        data["birthdate"] = "invalid"
        response = self.client.patch(f"{self.url}2/", data)
        self.assertEqual(response.status_code, 400)

    @patch('django.core.files.storage.default_storage.save')
    def test_upload_profile_image(self, mock_save):
        self.client.force_authenticate(user=self.user)

        mock_save.return_value = "test1.png"
        test_image = SimpleUploadedFile(
            "test1.jpg", b"file_content", content_type="image/jpeg"
        )
        response = self.client.patch(
            f"{self.url}2/image/", data={"profile_image": test_image}, format="multipart"
        )
        self.assertEqual(response.status_code, 200)

    def test_upload_profile_image_fail(self):
        self.client.force_authenticate(user=self.user)

        ## 2. no data
        response = self.client.patch(f"{self.url}2/image/")
        self.assertEqual(response.status_code, 400)
