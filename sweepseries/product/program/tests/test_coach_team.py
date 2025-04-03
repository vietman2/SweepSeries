from rest_framework.test import APITestCase

from auth.user.models import User
from product.academy.models import Academy

class CoachTeamTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/test/coaches.json",
        "core/data/test/programs.json", "core/data/initial/facilities.json",
        "core/data/initial/programs.json", "core/data/initial/professions.json"
    ]

    def setUp(self):
        self.url = "/v1/programs/1/coaches/"
        self.user = User.objects.get(username="normaluser")
        self.userprofile = self.user.profiles.first()
        self.academy = Academy.objects.get(name="아카데미 1")
        self.data = {
            "uuids": ["923e4567-e89b-12d3-a456-426614174999"],
        }

    def test_create(self):
        response = self.client.post(self.url, data=self.data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. program does not exist
        response = self.client.post("/v1/programs/999/coaches/", data={}, format="json")
        self.assertEqual(response.status_code, 404)

        ## 2. no data
        response = self.client.post(self.url, data={}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_delete(self):
        self.client.post(self.url, data=self.data, format="json")
        response = self.client.delete(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    def test_delete_fail(self):
        ## 1. program does not exist
        response = self.client.delete("/v1/programs/999/coaches/1/")
        self.assertEqual(response.status_code, 404)

        ## 2. team does not exist
        response = self.client.delete(f"{self.url}999/")
        self.assertEqual(response.status_code, 404)
