from django.conf import settings
from rest_framework.test import APITestCase

from auth.user.models import User

class CoachAdminAPITestCase(APITestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/staff/coaches/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")
        self.uuid = "923e4567-e89b-12d3-a456-426614174999"
        ## set default origin http
        self.client.defaults['HTTP_ORIGIN'] = settings.ADMIN_PAGE_URL

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 405)

        response = self.client.get(f"{self.url}{self.uuid}/")
        self.assertEqual(response.status_code, 405)

    def test_coach_list_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {'status': '승인 거부'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {'status': '승인 대기'})
        self.assertEqual(response.status_code, 200)

        response = self.client.get(self.url, {'status': '승인 완료'})
        self.assertEqual(response.status_code, 200)

    def test_coach_list_fail(self):
        ## not admin page
        some_other_origin = "http://localhost:3001"
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, {'status': '승인 거부'}, HTTP_ORIGIN=some_other_origin)
        self.assertEqual(response.status_code, 403)

        ## not admin
        self.client.defaults['HTTP_ORIGIN'] = settings.ADMIN_PAGE_URL
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url, {'status': '승인 거부'})
        self.assertEqual(response.status_code, 403)

        ## bad status
        self.client.force_authenticate(user=self.admin)
        self.client.defaults['HTTP_ORIGIN'] = settings.ADMIN_PAGE_URL
        response = self.client.get(self.url, {'status': 'bad_status'})
        self.assertEqual(response.status_code, 400)

    def test_coach_approve(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f"{self.url}{self.uuid}/accept/")
        self.assertEqual(response.status_code, 200)

    def test_coach_reject(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f"{self.url}{self.uuid}/reject/", {
            "reject_reason": "이유"
        })
        self.assertEqual(response.status_code, 200)

    def test_coach_reject_fail(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(f"{self.url}{self.uuid}/reject/")
        self.assertEqual(response.status_code, 400)
