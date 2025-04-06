from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase

from auth.user.models import User

class AgreementsManagementTestCase(APITestCase):
    fixtures = ["core/data/test/agreements.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/agreements/manage/"
        self.admin = User.objects.get(username="admin")
        self.create_data = {
            "title": "test",
            "required": True,
            "content": "test content"
        }
        self.update_data = {
            "agreement": 1,
            "content": "updated content",
            "summary": "updated"
        }
        self.admin_url = settings.ADMIN_PAGE_URL

    def test_list(self):
        self.client.force_authenticate(self.admin)

        ## 1. should fail if origin is not admin page
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. should succeed if origin is admin page
        response = self.client.get(self.url, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, 200)

    def test_retrieve(self):
        self.client.force_authenticate(self.admin)

        ## 1. should fail if origin is not admin page
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. should succeed if origin is admin page
        response = self.client.get(self.url + "1/", HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create(self):
        self.client.force_authenticate(self.admin)

        ## 1. Normal
        response = self.client.post(self.url, self.create_data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ## 2. Blank Content
        data = self.create_data.copy()
        data["content"] = ""
        response = self.client.post(self.url, data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_fail(self):
        ## 1. not authenticated
        response = self.client.post(self.url, self.create_data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(self.admin)

        ## 2. should fail if origin is not admin page
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 3. no content
        data = self.create_data.copy()
        data.pop("content")
        response = self.client.post(self.url, data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. no title
        data = self.create_data.copy()
        data.pop("title")
        response = self.client.post(self.url, data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete(self):
        self.client.force_authenticate(self.admin)
        response = self.client.delete(self.url + "1/", HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_update(self):
        self.client.force_authenticate(self.admin)
        response = self.client.put(self.url + "1/", self.update_data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_fail(self):
        ## 1. no summary
        self.client.force_authenticate(self.admin)
        data = self.update_data.copy()
        data.pop("summary")
        response = self.client.put(self.url + "1/", data, HTTP_ORIGIN=self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
