import json
from unittest.mock import patch
import requests_mock
from django.conf import settings
from django.contrib.admin import AdminSite
from django.test import TestCase, RequestFactory
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from auth.person.models import Person
from .forms import UserAdmin, CustomUserCreationForm
from .models import User, PhoneVerification

class UserAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/academies.json",
        "core/data/initial/regions.json", "core/data/test/coaches.json",
        "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.url = "/v1/users/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")
        self.coach = User.objects.get(username="coachuser")

    def test_no_permission(self):
        ## 1. not logged in
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ## 2. not superuser
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_users_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_retrieve(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + str(self.normaluser.uuid) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me(self):
        ## 1. normal user
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. admin
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 3. coach
        self.client.force_authenticate(user=self.coach)
        response = self.client.get(self.url + "me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 4. full
        response = self.client.get(self.url + "me/", {
            "full": True,
            "profile_id": 1,
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
        ## 1. normal
        response = self.client.post(self.url, {
            "username": "user",
            "password": "user123!"
        }, HTTP_USER_AGENT="sweep")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ## 2. admin in admin page
        response = self.client.post(self.url, {
            "username": "admin",
            "password": "admin123!"
        }, HTTP_ORIGIN=settings.ADMIN_PAGE_URL, HTTP_USER_AGENT="normal")
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

class UserModelTest(TestCase):
    fixtures = ["core/data/test/users.json"]

    def test_str(self):
        user = User.objects.get(username="admin")
        expected_str = "admin (관리자)"
        self.assertEqual(str(user), expected_str)

    def test_has_perm(self):
        user = User.objects.get(username="admin")
        self.assertTrue(user.has_perm("auth.change_user"))

    def test_has_module_perms(self):
        user = User.objects.get(username="admin")
        self.assertTrue(user.has_module_perms("auth"))

    def test_create_user(self):
        person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        user = User.objects.create_user(
            username="testuser",
            email="test@email.com",
            password="testpassword",
            person=person
        )
        self.assertEqual(user.username, "testuser")

    def test_create_superuser(self):
        person = Person.objects.create(
            name='Test User',
            phone_number='010-9999-9999'
        )
        user = User.objects.create_superuser(
            username="testadmin",
            email="test@admin.com",
            password="testpassword",
            person=person
        )
        self.assertEqual(user.username, "testadmin")

class UserFormTest(TestCase):
    def test_user_creation_form(self):
        person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        form_data = {
            'email': 'email@email.com',
            'username': 'testuser',
            'is_staff': True,
            'is_active': True,
            'person': person,
            'password': 'testpassword'
        }
        form = CustomUserCreationForm(data=form_data)

        self.assertTrue(form.is_valid())
        user = form.save()
        self.assertEqual(user.username, 'testuser')

    def test_user_creation_form_invalid(self):
        person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        form_data = {
            'emaill': 'email@email.com',
            'username': 'testuser',
            'is_staff': True,
            'is_active': True,
            'person': person,
            'password': 'testpassword'
        }
        form = CustomUserCreationForm(data=form_data)

        self.assertFalse(form.is_valid())

    def test_user_creation_form_no_commit(self):
        person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        form_data = {
            'email': 'email@email.com',
            'username': 'testuser',
            'is_staff': True,
            'is_active': True,
            'person': person,
            'password': 'testpassword'
        }

        form = CustomUserCreationForm(data=form_data)
        user = form.save(commit=False)

        self.assertEqual(user.username, 'testuser')

class UserAdminTest(TestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.site = AdminSite()
        self.user_admin = UserAdmin(User, self.site)
        self.factory = RequestFactory()

    def test_create_form(self):
        request = self.factory.get('/admin/user/user/add/')
        self.user_admin.get_form(request, obj=None)

    def test_update_form(self):
        user = User.objects.get(username="admin")
        request = self.factory.get(f'/admin/user/user/{user.uuid}/change/')
        self.user_admin.get_form(request, obj=user)
