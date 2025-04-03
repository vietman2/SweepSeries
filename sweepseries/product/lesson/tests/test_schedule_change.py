from rest_framework.test import APITestCase

from auth.user.models import User

class ScheduleChangeAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/professions.json",
        "core/data/test/coaches.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/programs.json", "core/data/initial/programs.json",
        "core/data/test/contracts.json", "core/data/test/lessons.json",
        "core/data/initial/reviewtags.json",
    ]

    def setUp(self):
        self.url = "/v1/sessions/1/schedule_change/"
        self.user = User.objects.get(username="normaluser")
        self.create_data = {
            "date": "2025-02-01",
            "time": "01:00",
        }

    def test_create(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        self.client.force_authenticate(user=self.user)

        ## 1. bad data
        response = self.client.post("/v1/sessions/a/schedule_change/", self.create_data)
        self.assertEqual(response.status_code, 400)

        ## 2. no session
        response = self.client.post("/v1/sessions/999/schedule_change/", self.create_data)
        self.assertEqual(response.status_code, 400)

        ## 3. bad date/time
        response = self.client.post(self.url, {"date": "2025-02-01", "time": "bad"})
        self.assertEqual(response.status_code, 400)
