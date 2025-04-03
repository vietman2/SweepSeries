from rest_framework.test import APITestCase

from auth.user.models import User

class SessionAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/lessons.json",
        "core/data/test/coaches.json", "core/data/test/programs.json",
        "core/data/test/academies.json", "core/data/initial/regions.json",
        "core/data/initial/professions.json", "core/data/test/contracts.json",
        "core/data/initial/reviewtags.json",
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
            {
                "date": "2025-02-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174999",
                "mode": "student"
            }
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
            {
                "date": "2025-02-01",
                "uuid": "923e4567-e89b-12d3-a456-426614174999",
                "mode": "student"
            }
        )
        self.assertEqual(response.status_code, 400)

    def test_available_times(self):
        url = f"{self.url}1/available_times/"
        self.client.force_authenticate(user=self.user)

        ## 1. no time (saturday: coach off)
        response = self.client.get(url, {"date": "2025-02-01"})
        self.assertEqual(response.status_code, 200)

        ## 2. closed (sunday: academy off)
        response = self.client.get(url, {"date": "2025-02-02"})
        self.assertEqual(response.status_code, 200)

        ## 3. success
        response = self.client.get(url, {"date": "2025-02-03"})
        self.assertEqual(response.status_code, 200)

    def test_available_times_fail(self):
        url = f"{self.url}1/available_times/"
        self.client.force_authenticate(user=self.user)

        ## 1. no date
        response = self.client.get(url)
        self.assertEqual(response.status_code, 400)

        ## 2. bad date
        response = self.client.get(url, {"date": "2025/02/01"})
        self.assertEqual(response.status_code, 400)
