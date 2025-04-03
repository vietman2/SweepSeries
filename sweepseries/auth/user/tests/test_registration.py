import json
from unittest.mock import patch
import requests_mock
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from auth.person.models import Person
from ..models import PhoneVerification

class RegisterAPITestCase(APITestCase):
    def setUp(self):
        self.verify_code = PhoneVerification.objects.create(
            phone_number="010-1234-1234",
            verification_code="123456"
        )
        self.user_data = {
            "username": "testuser",
            "email": "email@email.com",
            "password": "testpassword123!",
            "password2": "testpassword123!",
            "phone": "010-1234-1234",
            "name": "Test User"
        }
        self.profile_data = {
            "gender": "남성",
            "birthdate": "1990-01-01",
            "nickname": "testuser",
            "profileImage": "http://test.com/test.jpg",
        }

    def test_check_username(self):
        ## 1. normal
        response = self.client.get("/v1/check-username-email/", {
            "username": "testuser",
            "email": "email@email.com"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_username_fail(self):
        ## 1. no username
        response = self.client.get("/v1/check-username-email/", {
            "username": "",
            "email": "email@email.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. invalid username
        response = self.client.get("/v1/check-username-email/", {
            "username": "_admin",
            "email": "email@email.com"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. invalid length
        response = self.client.get("/v1/check-username-email/", {
            "username": "a",
            "email": "email@email.com",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. already exists
        self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": self.user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        response = self.client.get("/v1/check-username-email/", {
            "username": "testuser",
            "email": "new@email.com",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 5. no email
        response = self.client.get("/v1/check-username-email/", {
            "username": "newuser",
            "email": "",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 6. invalid email
        response = self.client.get("/v1/check-username-email/", {
            "username": "newuser",
            "email": "email",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 7. already exists
        response = self.client.get("/v1/check-username-email/", {
            "username": "newuser",
            "email": "email@email.com",
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_check_password(self):
        ## 1. normal
        response = self.client.post("/v1/check-password/", {
            "password": "testpassword123!",
            "password2": "testpassword123!"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_check_password_fail(self):
        ## 1. no data
        response = self.client.post("/v1/check-password/", {
            "password": "",
            "password2": ""
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. not match
        response = self.client.post("/v1/check-password/", {
            "password": "testpassword123!",
            "password2": "testpassword123"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. too short
        response = self.client.post("/v1/check-password/", {
            "password": "test",
            "password2": "test"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. no english
        response = self.client.post("/v1/check-password/", {
            "password": "123454321",
            "password2": "123454321"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 5. no number
        response = self.client.post("/v1/check-password/", {
            "password": "testpassword",
            "password2": "testpassword"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 6. no special character
        response = self.client.post("/v1/check-password/", {
            "password": "testpassword123",
            "password2": "testpassword123"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @requests_mock.Mocker()
    def test_create_code(self, m):
        ## 1. normal
        result = {"result_code": "1"}
        m.post(
            "https://apis.aligo.in/send/",
            status_code=200,
            content=json.dumps(result).encode("utf-8")
        )
        response = self.client.post("/v1/verification-code/", {
            "phone": "010-1234-1234"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @requests_mock.Mocker()
    def test_create_code_fail(self, m):
        ## 1. no phone
        response = self.client.post("/v1/verification-code/", {
            "phone": ""
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. already exists
        Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        response = self.client.post("/v1/verification-code/", {
            "phone": "010-1234-1234"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. aligo error
        result = {"result_code": "0"}
        m.post(
            "https://apis.aligo.in/send/",
            status_code=200,
            content=json.dumps(result).encode("utf-8")
        )
        response = self.client.post("/v1/verification-code/", {
            "phone": "010-1234-5678"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        ## 4. server error
        m.post(
            "https://apis.aligo.in/send/",
            status_code=500
        )
        response = self.client.post("/v1/verification-code/", {
            "phone": "010-1234-5678"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_verify_phone(self):
        ## 1. normal
        response = self.client.post("/v1/verify-phone/", {
            "phone": "010-1234-1234",
            "code": "123456"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch("django.utils.timezone.now")
    def test_verify_phone_fail(self, mock_now):
        ## 1. no data
        response = self.client.post("/v1/verify-phone/", {
            "phone": "",
            "code": ""
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. no phone number in db
        response = self.client.post("/v1/verify-phone/", {
            "phone": "010-1111-1111",
            "code": "123456"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. wrong code
        response = self.client.post("/v1/verify-phone/", {
            "phone": "010-1234-1234",
            "code": "654321"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. expired code
        mock_now.return_value = self.verify_code.created_at + timezone.timedelta(seconds=181)
        response = self.client.post("/v1/verify-phone/", {
            "phone": "010-1234-1234",
            "code": "123456"
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_catchb(self):
        ## 1. normal
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": self.user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_catchb2(self):
        ## 1. invalid gender
        profile_data = self.profile_data.copy()
        profile_data['gender'] = 'invalid'
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": self.user_data,
            "profile": profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_kakao(self):
        ## 1. normal + no birthdate + female + no profile image
        user_data = self.user_data.copy()
        user_data["password"] = ""
        user_data["password2"] = ""
        profile_data = self.profile_data.copy()
        profile_data["birthdate"] = ""
        profile_data["gender"] = "여성"
        profile_data["profileImage"] = ""
        response = self.client.post("/v1/register/", {
            "mode": "kakao",
            "user": user_data,
            "profile": profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_naver(self):
        ## 1. normal + no notifications + other (gender)
        user_data = self.user_data.copy()
        user_data["password"] = ""
        user_data["password2"] = ""
        profile_data = self.profile_data.copy()
        profile_data['gender'] = '기타'
        response = self.client.post("/v1/register/", {
            "mode": "naver",
            "user": user_data,
            "profile": profile_data,
            "notifications": False
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_register_fail(self):
        ## 1. invalid mode
        response = self.client.post("/v1/register/", {
            "mode": "invalid",
            "user": {},
            "profile": {},
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 2. no data
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": {},
            "profile": {},
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 3. invalid username
        user_data = self.user_data.copy()
        user_data["username"] = "_admin"
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 4. password not match
        user_data = self.user_data.copy()
        user_data["password2"] = "testpassword"
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 5. invalid email
        user_data = self.user_data.copy()
        user_data["email"] = "email"
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        ## 6. invalid password
        user_data = self.user_data.copy()
        user_data["password"] = "testpassword"
        user_data["password2"] = "testpassword"
        response = self.client.post("/v1/register/", {
            "mode": "catchb",
            "user": user_data,
            "profile": self.profile_data,
            "notifications": True
        }, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
