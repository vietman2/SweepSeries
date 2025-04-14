from django.test import TestCase
from rest_framework.test import APITestCase

from auth.user.models import User
from ..models import Coach, CoachProfession

class CoachLikesTestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/coaches/"
        self.user = User.objects.get(username="normaluser")

    def test_coach_liked(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}liked/")
        self.assertEqual(response.status_code, 200)

    def test_coach_like(self):
        self.client.force_authenticate(user=self.user)
        ## 1. like
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/like/")
        self.assertEqual(response.status_code, 200)

        ## 2. unlike
        response = self.client.post(f"{self.url}923e4567-e89b-12d3-a456-426614174999/like/")
        self.assertEqual(response.status_code, 200)

class CoachModelsTestCase(TestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def test_coach_str(self):
        coach = Coach.objects.get(uuid="923e4567-e89b-12d3-a456-426614174999")
        self.assertEqual(str(coach), "홍길동 - (아카데미 1)")

    def test_coach_profession_str(self):
        coach_profession = CoachProfession.objects.get(pk=1)
        self.assertEqual(str(coach_profession), "투수 전문")
