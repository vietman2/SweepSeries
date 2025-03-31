from rest_framework.test import APITestCase

from auth.user.models import User
from product.coach.models import Coach

class CoachReviewsAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/initial/programs.json",
        "core/data/test/calendar.json", "core/data/test/programs.json",
        "core/data/initial/reviewtags.json", "core/data/test/contracts.json",
    ]

    def setUp(self):
        self.coach = Coach.objects.get(uuid="923e4567-e89b-12d3-a456-426614174999")
        self.url = f"/v1/coaches/{self.coach.uuid}/reviews/"
        self.user = User.objects.get(username="normaluser")

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

    def test_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('results', response.data)
        self.assertGreater(len(response.data['results']), 0)

    def test_list_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"/v1/coaches/{self.user.uuid}/reviews/")
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], "코치를 찾을 수 없습니다.")
