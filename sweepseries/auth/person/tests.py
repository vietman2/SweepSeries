from django.conf import settings
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from auth.user.models import User
from product.academy.models import Academy
from .models import Person

class PersonAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/people/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")

    def test_no_permission(self):
        ## not logged in
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_people_list_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_people_list_normal(self):
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url, {"phone": "010-2222-2222"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_people_list_normal_fail(self):
        ## no param
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_people_retrieve(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

class AcademyStudentAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.url = "/v1/academies/"
        self.user = User.objects.get(username="normaluser")
        self.academy = Academy.objects.get(name="아카데미 1")

    def test_students_list(self):
        self.client.force_authenticate(user=self.user)
        ## 1. normal
        response = self.client.get(f"{self.url}{self.academy.uuid}/students/")
        self.assertEqual(response.status_code, 200)

        ## 2. with query
        response = self.client.get(f"{self.url}{self.academy.uuid}/students/?query=학생")
        self.assertEqual(response.status_code, 200)

    def test_students_retrieve(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{self.academy.uuid}/students/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_students_retrieve_fail(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}{self.academy.uuid}/students/3/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class PersonModelTest(TestCase):
    fixtures = ["core/data/test/users.json"]

    def test_str(self):
        person = Person.objects.get(pk=1)
        expected_str = "관리자"
        self.assertEqual(str(person), expected_str)
