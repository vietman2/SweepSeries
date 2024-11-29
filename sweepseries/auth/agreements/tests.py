from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase

from auth.user.models import User

class AgreementsAPITestCase(APITestCase):
    fixtures = ["core/data/test/agreements.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/agreements/"
        self.admin = User.objects.get(username="admin")

    def test_agreements_list(self):
        ## 1. normal
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

        ## 2. admin from admin page
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_agreements_retrieve(self):
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
