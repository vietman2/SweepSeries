from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from auth.user.models import User
from .models import Agreement, AgreementVersion

class AgreementsAPITestCase(APITestCase):
    fixtures = ["core/data/test/agreements.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/agreements/"
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

    def test_agreements_list(self):
        ## 1. normal
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

        ## 2. admin from admin page
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 3. with query
        response = self.client.get(self.url, {"query": "Mandatory without content"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 4. with version
        response = self.client.get(self.url, {"query": "Mandatory without content", "version": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_agreements_retrieve(self):
        ## 1. normal
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. admin from admin page
        response = self.client.get(self.url + "1/", HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_agreements_create(self):
        ## 1. normal
        self.client.force_authenticate(self.admin)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ## 2. blank content
        data = self.create_data.copy()
        data["content"] = ""
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_agreements_create_fail(self):
        ## 1. not authenticated
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. no content
        self.client.force_authenticate(self.admin)
        data = self.create_data.copy()
        data.pop("content")
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. no title
        data = self.create_data.copy()
        data.pop("title")
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_agreements_destroy(self):
        self.client.force_authenticate(self.admin)
        response = self.client.delete(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_agreements_update(self):
        self.client.force_authenticate(self.admin)
        response = self.client.put(self.url + "1/", self.update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_agreements_update_fail(self):
        ## 1. no summary
        self.client.force_authenticate(self.admin)
        data = self.update_data.copy()
        data.pop("summary")
        response = self.client.put(self.url + "1/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AgreementModelTest(TestCase):
    fixtures = ["core/data/test/agreements.json"]

    def test_agreement_str(self):
        agreement = Agreement.objects.get(pk=1)
        self.assertEqual(str(agreement), "Mandatory without content")

    def test_agreement_version_str(self):
        version = AgreementVersion.objects.get(pk=1)
        self.assertEqual(str(version), "Mandatory without content - 2024-11-30")
