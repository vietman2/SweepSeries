from rest_framework.test import APITestCase

from auth.user.models import User
from product.academy.models import Academy

class AcademyReviewsAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/initial/programs.json",
        "core/data/test/calendar.json", "core/data/test/programs.json",
        "core/data/initial/reviewtags.json", "core/data/test/contracts.json",
    ]

    def setUp(self):
        self.academy = Academy.objects.get(name="아카데미 1")
        self.url = f"/v1/academies/{self.academy.uuid}/reviews/"
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

        ## 1. invalid academy
        invalid_url = f"/v1/academies/{self.user.uuid}/reviews/"
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, 400)
