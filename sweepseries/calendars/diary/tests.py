from rest_framework.test import APITestCase

from auth.user.models import User

class DiaryAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/diaries/"
        self.calendar_owner = User.objects.get(username="normaluser")
        self.create_data = {
            "diary": "다이어리 내용",
            "date": "2025-01-01",
        }

    def test_create_diary(self):
        ## create diary
        self.client.force_authenticate(user=self.calendar_owner)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

        ## update diary
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## no auth: not logged in
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## no data
        self.client.force_authenticate(user=self.calendar_owner)
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)
