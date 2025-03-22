from rest_framework.test import APITestCase

from auth.user.models import User
from product.contract.models import Contract

class LessonAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/professions.json",
        "core/data/test/coaches.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/programs.json", "core/data/initial/programs.json",
        "core/data/test/calendar.json",
    ]

    def setUp(self):
        self.url = "/v1/lessons/"
        self.user = User.objects.get(username="normaluser")
        self.create_data = {
            "program": 1,
            "coaches": ["923e4567-e89b-12d3-a456-426614174999"],
            "start_datetime": "2025-02-01T00:00:00Z",
            "person": {
                "name": "lesson",
                "phone": "lesson",
            },
            "curriculum_id": 1,
        }
        self.create_data2 = {
            "program": 1,
            "coaches": ["923e4567-e89b-12d3-a456-426614174999"],
            "start_datetime": "2025-02-01T00:00:00Z",
            "person": {
                "name": "lesson",
                "phone": "+821000000000",
            },
            "curriculum_id": 1,
        }
        self.create_data3 = {
            "program": 1,
            "coaches": ["923e4567-e89b-12d3-a456-426614174999"],
            "start_datetime": "2025-02-01T00:00:00Z",
            "person": {
                "id": 1,
                "name": "lesson",
                "phone": "+821000000000",
            },
            "curriculum_id": 1,
        }

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{1}/")
        self.assertEqual(response.status_code, 405)

    def test_list_lesson_normal(self):
        ## With Contract (should not happen. Only to raise coverage)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"program": 1, "student": 1})
        self.assertEqual(response.status_code, 200)

        ## New to academy
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"program": 1, "student": 2})
        self.assertEqual(response.status_code, 200)

        ## No Contract (should not happen. Only to raise coverage)
        Contract.objects.all().delete()
        response = self.client.get(self.url, {"program": 1, "student": 1})
        self.assertEqual(response.status_code, 400)

    def test_list_lesson_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"program": 1, "student": 1})
        self.assertEqual(response.status_code, 200)

    def test_create_lesson_normal(self):
        self.client.force_authenticate(user=self.user)
        ## 1. new person
        response = self.client.post(self.url, self.create_data, format="json")
        self.assertEqual(response.status_code, 201)

        ## 2. existing person
        response = self.client.post(self.url, self.create_data2, format="json")
        self.assertEqual(response.status_code, 201)

        ## 3. existing person (2)
        response = self.client.post(self.url, self.create_data3, format="json")
        self.assertEqual(response.status_code, 201)

    def test_create_lesson_fail(self):
        self.client.force_authenticate(user=self.user)

        ## 1. no data
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)

        ## 2. bad data: no curriculum
        data = self.create_data.copy()
        data["curriculum_id"] = 0
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

class SessionAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/calendar.json",
        'core/data/test/coaches.json', 'core/data/test/programs.json',
        'core/data/test/academies.json', 'core/data/initial/regions.json',
        'core/data/initial/professions.json',
    ]

    def setUp(self):
        self.url = "/v1/sessions/"
        self.user = User.objects.get(username="normaluser")
        self.student = User.objects.get(username="admin")

    def test_list_session_normal(self):
        ## no sessions
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"month": "2025-02"})
        self.assertEqual(response.status_code, 200)

        ## with sessions
        self.client.force_authenticate(user=self.student)
        response = self.client.get(self.url, {"month": "2025-02"})
        self.assertEqual(response.status_code, 200)

    def test_list_session_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)

        response = self.client.get(self.url, {"month": "asdf-as"})
        self.assertEqual(response.status_code, 400)

    def test_retrieve_session_normal(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 200)

    def test_update_session_notes(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/", {"notes": "test"}, format="json")
        self.assertEqual(response.status_code, 200)

    def test_update_session_feedback(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/", {"feedback": "test"}, format="json")
        self.assertEqual(response.status_code, 200)

    def test_update_session_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}1/", {"feedback": ""}, format="json")
        self.assertEqual(response.status_code, 400)

        response = self.client.patch(f"{self.url}1/", {"notes": ""}, format="json")
        self.assertEqual(response.status_code, 400)

    def test_daily_sessions(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            f"{self.url}daily/",
            {"date": "2025-02-01", "uuid": "123e4567-e89b-12d3-a456-426614174999", "mode": "student"}
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.get(
            f"{self.url}daily/",
            {"date": "2025-02-01", "uuid": "923e4567-e89b-12d3-a456-426614174999", "mode": "coach"}
        )
        self.assertEqual(response.status_code, 200)

    def test_daily_sessions_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}daily/")
        self.assertEqual(response.status_code, 400)

        response = self.client.get(
            f"{self.url}daily/",
            {"date": "2025-02-01", "uuid": "123e4567-e89b-12d3-a456-426614174999", "mode": "coach"}
        )
        self.assertEqual(response.status_code, 400)

        response = self.client.get(
            f"{self.url}daily/",
            {"date": "2025-02-01", "uuid": "923e4567-e89b-12d3-a456-426614174999", "mode": "student"}
        )
        self.assertEqual(response.status_code, 400)

class SessionRequestAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/professions.json",
        "core/data/test/coaches.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/programs.json", "core/data/initial/programs.json",
        "core/data/test/calendar.json", "core/data/test/lessons.json"
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
