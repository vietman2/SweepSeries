from rest_framework.test import APITestCase

from auth.user.models import User
from product.academy.models import Academy

class ProgramTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/initial/programs.json",
    ]

    def setUp(self):
        self.url = "/v1/programs/"
        self.user = User.objects.get(username="normaluser")
        self.academy = Academy.objects.get(name="아카데미 1")
        self.data = {
            "name": "프로그램 1",
            "academy": str(self.academy.uuid),
            "target": 1,
            "positions": [1, 2],
            "duration": "60",
            "curriculums": [
                {
                    "num_lessons": 10,
                    "price": 100000,
                }
            ]
        }

    def test_targets(self):
        response = self.client.get(f"{self.url}targets/")
        self.assertEqual(response.status_code, 200)

    def test_positions(self):
        response = self.client.get(f"{self.url}positions/")
        self.assertEqual(response.status_code, 200)

    def test_list(self):
        response = self.client.get(f"{self.url}?academy={self.academy.uuid}")
        self.assertEqual(response.status_code, 200)

    def test_list_fail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

    def test_create(self):
        response = self.client.post(self.url, data=self.data, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. no params
        data = {}
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 2. bad data (bad duration)
        data = self.data.copy()
        data["duration"] = "45"
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 3. bad data (bad num_lessons and price)
        data = self.data.copy()
        data["curriculums"][0]["num_lessons"] = 0
        data["curriculums"][0]["price"] = -100000
        response = self.client.post(self.url, data=data, format="json")
        self.assertEqual(response.status_code, 400)
