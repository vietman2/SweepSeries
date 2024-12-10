from django.conf import settings
from django.contrib.admin import AdminSite
from django.test import TestCase, RequestFactory
from rest_framework import status
from rest_framework.test import APITestCase

from auth.person.models import Person
from .forms import UserAdmin, CustomUserCreationForm
from .models import User

class UserAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/users/"
        self.admin = User.objects.get(username="admin")
        self.normaluser = User.objects.get(username="normaluser")

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
        self.client.force_authenticate(user=self.normaluser)
        response = self.client.get(self.url + "me/")
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

class NaverLoginTest(APITestCase):
    def setUp(self):
        self.url = "/v1/login/naver/"
        self.data = {
            "username": "naveruser",
            "email": "email@email.com",
            "name": "Test User",
            "phone_number": "010-1234-1234",
            "birthday": "01-01",
            "birthyear": "1990",
            "gender": "M",
            "nickname": "testuser",
            "profile_image": "https://test.com/test.jpg"
        }

    def test_naver_login_1(self):
        ## 1. new person
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_naver_login_1_fail(self):
        ## no username
        data = self.data.copy()
        data.pop('username')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_naver_login_2(self):
        ## 2. existing person
        Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        data = self.data.copy()
        data['gender'] = 'F'
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_naver_login_2_fail(self):
        ## email already exists
        person = Person.objects.create(
            name='Test User 1',
            phone_number='010-5678-5678'
        )
        User.objects.create_user(
            username="naveruser1",
            email="email@email.com",
            password="testpassword",
            person=person
        )
        Person.objects.create(
            name='Test User 1',
            phone_number='010-1234-1234'
        )
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_naver_login_3(self):
        ## 3. existing user
        person = Person.objects.create(
            name='Test User',
            phone_number='010-1234-1234'
        )
        User.objects.create_user(
            username="naveruser",
            email="email@email.com",
            password="testpassword",
            person=person
        )
        response = self.client.post(self.url, self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_naver_login_4(self):
        ## 4. undefined gender and nickname
        data = self.data.copy()
        data['gender'] = 'X'
        data['nickname'] = ''
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class KakaoLoginTest(APITestCase):
    def setUp(self):
        self.url = "/v1/login/kakao/"

    def test_kakao_login(self):
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, status.HTTP_501_NOT_IMPLEMENTED)
