from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase

from auth.person.models import Person
from ..models import User

class LoginAPITestCase(APITestCase):
    def setUp(self):
        self.url = "/v1/login/"
        user_person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        self.user = User.objects.create_user(
            username="user",
            email="us@er.com",
            password="user123!",
            is_superuser=False,
            person=user_person
        )
        admin_person = Person.objects.create(
            name='Admin',
            phone_number='010-4321-4321'
        )
        self.admin = User.objects.create_user(
            username="admin",
            email="ad@min.com",
            password="admin123!",
            is_superuser=True,
            person=admin_person
        )

    def test_login(self):
        ## 1. normal from mobile app
        custom_header = {
            "X-Sweep-Platform": "sweep/mobile",
        }
        response = self.client.post(self.url, {
            "username": "user",
            "password": "user123!"
        }, headers=custom_header)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. normal from web
        response = self.client.post(self.url, {
            "username": "user",
            "password": "user123!"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 3. admin in admin page
        response = self.client.post(self.url, {
            "username": "admin",
            "password": "admin123!"
        }, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_fail(self):
        ## 1. wrong password
        response = self.client.post(self.url, {
            "username": "user",
            "password": "wrongpassword"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. normal user in admin page
        response = self.client.post(self.url, {
            "username": "user",
            "password": "user123!"
        }, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_social_login(self):
        ## 1. not registered
        response = self.client.post("/v1/login/social/", {
            "username": "newuser"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. normal
        response = self.client.post("/v1/login/social/", {
            "username": "user"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_social_login_fail(self):
        ## 1. no username
        response = self.client.post("/v1/login/social/", {
            "username": ""
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
