from rest_framework import status
from rest_framework.test import APITestCase

from auth.user.models import User

class PersonAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/people/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")

    def test_no_permission(self):
        ## 1. not logged in
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. not superuser
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_people_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_people_retrieve(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
