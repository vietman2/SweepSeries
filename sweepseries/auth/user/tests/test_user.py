from rest_framework import status
from rest_framework.test import APITestCase

from ..models import User

class UserAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/academies.json",
        "core/data/initial/regions.json", "core/data/test/coaches.json",
        "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/users/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")
        self.coach = User.objects.get(username="coachuser")

    def test_no_permission(self):
        ## 1. not logged in
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. not superuser
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_users_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_retrieve(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + str(self.normaluser.uuid) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me(self):
        ## 1. normal user
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. admin
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 3. coach
        self.client.force_authenticate(user=self.coach)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 4. full
        response = self.client.get(self.url + "me/", {
            "full": True,
            "profile_id": 1,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
