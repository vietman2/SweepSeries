from rest_framework.test import APITestCase

from auth.user.models import User

class CoachAcademyOwnerAPITestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/coaches/923e4567-e89b-12d3-a456-426614174999/"
        self.user = User.objects.get(username="normaluser")
        self.user2 = User.objects.get(username="admin")

    def test_accept_coach(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f"{self.url}accept/")
        self.assertEqual(response.status_code, 200)

    def test_accept_coach_fail(self):
        ## 1. no auth
        self.client.force_authenticate(self.user2)
        response = self.client.post(f"{self.url}accept/")
        self.assertEqual(response.status_code, 403)

    def test_reject_coach(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(f"{self.url}reject/")
        self.assertEqual(response.status_code, 200)

    def test_reject_coach_fail(self):
        ## 1. no auth
        self.client.force_authenticate(self.user2)
        response = self.client.post(f"{self.url}reject/")
        self.assertEqual(response.status_code, 403)
