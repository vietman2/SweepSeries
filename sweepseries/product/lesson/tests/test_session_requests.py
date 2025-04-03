from rest_framework.test import APITestCase

from auth.user.models import User

class SessionRequestAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/professions.json",
        "core/data/test/coaches.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/programs.json", "core/data/initial/programs.json",
        "core/data/test/lessons.json", "core/data/test/contracts.json",
        "core/data/initial/reviewtags.json",
    ]

    def setUp(self):
        self.url = "/v1/lesson_requests/"
        self.user = User.objects.get(username="normaluser")
        self.no_auth = User.objects.get(username="user4")
        self.data = {
            "requests": [1, 2],
            "academy": "123e4567-e89b-12d3-a456-426614174999",
        }

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

    def test_create_lesson_request(self):
        self.client.force_authenticate(user=self.user)

        ## 1. select team
        response = self.client.post(f"{self.url}", {
            "program": 1,
            "team": 1,
            "start_datetime": "2025-02-01T00:00:00Z",
            "curriculum": 1,
        }, format="json")
        self.assertEqual(response.status_code, 201)

        ## 2. team select disabled
        response = self.client.post(f"{self.url}", {
            "program": 1,
            "team": -1,
            "start_datetime": "2025-02-01T00:00:00Z",
            "curriculum": 1,
        }, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_lesson_request_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(f"{self.url}", {
            "program": 0,
            "team": 1,
            "start_datetime": "2025-02-01T00:00:00Z",
            "curriculum": 0,
        }, format="json")
        self.assertEqual(response.status_code, 400)

    def test_lesson_request_list(self):
        self.client.force_authenticate(user=self.user)

        ## 1. no academy
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

        ## 2. success
        response = self.client.get(self.url, {"academy": "123e4567-e89b-12d3-a456-426614174999"})
        self.assertEqual(response.status_code, 200)

        ## 3. no auth
        self.client.force_authenticate(user=self.no_auth)
        response = self.client.get(self.url, {"academy": "123e4567-e89b-12d3-a456-426614174999"})
        self.assertEqual(response.status_code, 403)

    def test_request_accept(self):
        self.client.force_authenticate(user=self.user)

        ## 1. no data
        response = self.client.patch(f"{self.url}accept/", {}, format="json")
        self.assertEqual(response.status_code, 400)

        ## 2. success
        response = self.client.patch(f"{self.url}accept/", self.data, format="json")
        self.assertEqual(response.status_code, 200)

        ## 3. no academy
        data = self.data.copy()
        data["academy"] = "123e4567-e89b-12d3-a456-426614174998"
        response = self.client.patch(f"{self.url}accept/", data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 4. no requests
        data = self.data.copy()
        data["requests"] = [3]
        response = self.client.patch(f"{self.url}accept/", data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 5. no auth
        self.client.force_authenticate(user=self.no_auth)
        response = self.client.patch(f"{self.url}accept/", self.data, format="json")
        self.assertEqual(response.status_code, 403)

    def test_request_reject(self):
        self.client.force_authenticate(user=self.user)

        ## 1. no data
        response = self.client.patch(f"{self.url}reject/", {}, format="json")
        self.assertEqual(response.status_code, 400)

        ## 2. success
        response = self.client.patch(f"{self.url}reject/", self.data, format="json")
        self.assertEqual(response.status_code, 200)

        ## 3. no academy
        data = self.data.copy()
        data["academy"] = "123e4567-e89b-12d3-a456-426614174998"
        response = self.client.patch(f"{self.url}reject/", data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 4. no requests
        data = self.data.copy()
        data["requests"] = [3]
        response = self.client.patch(f"{self.url}reject/", data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 5. no auth
        self.client.force_authenticate(user=self.no_auth)
        response = self.client.patch(f"{self.url}reject/", self.data, format="json")
        self.assertEqual(response.status_code, 403)
