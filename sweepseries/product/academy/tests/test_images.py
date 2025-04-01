from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from unittest.mock import patch

from auth.user.models import User

class AcademyImageTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/123e4567-e89b-12d3-a456-426614174999/images/"
        self.user = User.objects.get(username="normaluser")
        self.test_image1 = SimpleUploadedFile(
            "test1.png", b"file_content", content_type="image/png"
        )

    @patch('django.core.files.storage.default_storage.save')
    def test_upload_image(self, mock_save):
        self.client.force_authenticate(user=self.user)
        mock_save.return_value = 'test.png'
        response = self.client.post(self.url, {"images": [self.test_image1]}, format="multipart")
        self.assertEqual(response.status_code, 201)

    def test_upload_image_fail(self):
        ## 1. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.post(self.url, {"images": [self.test_image1]}, format="multipart")
        self.assertEqual(response.status_code, 403)

        ## 2. no image
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {}, format="multipart")
        self.assertEqual(response.status_code, 400)

        ## 3. invalid image
        bad_image = SimpleUploadedFile(
            "test1.txt", b"file_content", content_type="text/plain"
        )
        response = self.client.post(self.url, {"images": [bad_image]}, format="multipart")
        self.assertEqual(response.status_code, 400)

    def test_delete_image(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 204)

    def test_delete_image_fail(self):
        ## 1. no auth
        user = User.objects.get(username="admin")
        self.client.force_authenticate(user=user)
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 403)

        ## 2. not found
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(f"{self.url}999/")
        self.assertEqual(response.status_code, 404)
