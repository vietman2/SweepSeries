from django.conf import settings
from rest_framework.test import APITestCase

from auth.user.models import User
from ..models import Academy

class AcademyTestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/academies/"
        self.user = User.objects.get(username="normaluser")
        self.academy = Academy.objects.get(name="아카데미 1")

    def test_academy_list(self):
        ## 1. no query and no auth
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        ## 2. query and no auth with sort by likes
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, {"query": "아카데미 1", "sortBy": "인기순"})
        self.assertEqual(response.status_code, 200)

        ## 3. sort by rating
        response = self.client.get(self.url, {"query": "아카데미 1", "sortBy": "평점순"})
        self.assertEqual(response.status_code, 200)

    def test_academy_list_admin(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': '승인 대기'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 완료'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

        param = {'status': '승인 거부'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

    def test_academy_list_admin_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        param = {'status': '승인'}
        response = self.client.get(self.url, param, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 400)

    def test_academy_detail(self):
        response = self.client.get(f"{self.url}{self.academy.uuid}/")
        self.assertEqual(response.status_code, 200)

        self.client.force_authenticate(user=self.user)
        academy2 = Academy.objects.get(name="아카데미 2")
        response = self.client.get(f"{self.url}{academy2.uuid}/")
        self.assertEqual(response.status_code, 200)

        self.client.force_authenticate(user=self.user)
        academy3 = Academy.objects.get(name="아카데미 3")
        response = self.client.get(f"{self.url}{academy3.uuid}/")
        self.assertEqual(response.status_code, 200)

    def test_academy_liked(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}liked/")
        self.assertEqual(response.status_code, 200)

    def test_academy_like(self):
        self.client.force_authenticate(user=self.user)
        ## 1. like
        response = self.client.post(f"{self.url}{self.academy.uuid}/like/")
        self.assertEqual(response.status_code, 200)

        ## 2. unlike
        response = self.client.post(f"{self.url}{self.academy.uuid}/like/")
        self.assertEqual(response.status_code, 200)

    def test_my_academy(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 200)

        admin = User.objects.get(username="admin")
        self.client.force_authenticate(user=admin)
        response = self.client.get(f"{self.url}my/", {"mode": "student"})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(f"{self.url}my/", {"mode": "coach"})
        self.assertEqual(response.status_code, 200)

    def test_my_academy_fail(self):
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.get(f"{self.url}my/")
        self.assertEqual(response.status_code, 404)

    def test_academy_recommendations(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}recommendations/")
        self.assertEqual(response.status_code, 200)

    def test_academy_approve(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/approve/")
        self.assertEqual(response.status_code, 200)

    def test_academy_reject(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/reject/", {
            "reject_reason": "이유"
        })
        self.assertEqual(response.status_code, 200)

    def test_academy_reject_fail(self):
        self.client.force_authenticate(user=User.objects.get(username="admin"))
        response = self.client.post(f"{self.url}123e4567-e89b-12d3-a456-426614174111/reject/")
        self.assertEqual(response.status_code, 400)

    def test_academy_employees(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{self.academy.uuid}/employees/")
        self.assertEqual(response.status_code, 200)
