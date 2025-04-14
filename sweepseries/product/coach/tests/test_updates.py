from unittest.mock import patch, MagicMock
from botocore.exceptions import ClientError
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase

from auth.user.models import User

class UpdateCoachAPITestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/coaches/"
        self.uuid = "923e4567-e89b-12d3-a456-426614174999"
        self.user = User.objects.get(username="normaluser")
        self.user2 = User.objects.get(username="admin")
        self.test_image = SimpleUploadedFile(
            "test1.jpg", b"file_content", content_type="image/jpeg"
        )

    def test_unallowed_methods(self):
        response = self.client.patch(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

    @patch('product.coach.utils.default_storage')
    def test_update_profile_image(self, mock_default_storage):
        mock_s3_client = MagicMock()
        mock_default_storage.connection.meta.client = mock_s3_client

        fake_bucket = MagicMock()
        fake_bucket.name = "test-bucket"
        mock_default_storage.bucket = fake_bucket

        expected_path = f"users/{self.user.uuid}/profiles/test1.jpg"
        fake_url = f"https://test.com/{expected_path}"
        mock_default_storage.url.return_value = fake_url

        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{self.uuid}/profile_image/", {
            "profile_image": self.test_image
        })
        self.assertEqual(response.status_code, 200)

    @patch('product.coach.mixins.update_mixins.upload_profile_image')
    def test_update_profile_image_fail(self, mock_upload_profile_image):
        ## 1. no data
        self.client.force_authenticate(self.user)
        response = self.client.patch(f"{self.url}{self.uuid}/profile_image/")
        self.assertEqual(response.status_code, 400)

        ## 2. boto3 error
        mock_upload_profile_image.side_effect = ClientError(
            error_response={},
            operation_name='test'
        )

        response = self.client.patch(f"{self.url}{self.uuid}/profile_image/", {
            "profile_image": self.test_image
        })
        self.assertEqual(response.status_code, 400)

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
        self.assertEqual(response.status_code, 400)
