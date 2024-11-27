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

    def test_login(self):
        person = Person.objects.create(
            first_name='Test',
            last_name='User',
            phone_number='010-1234-1234'
        )
        User.objects.create_user(
            username="testuser",
            email="ad@min.com",
            password="testuser",
            person=person
        )
        response = self.client.post("/v1/login/", {
            "username": "testuser",
            "password": "testuser"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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
            first_name='Test',
            last_name='User',
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
            first_name='Test',
            last_name='User',
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
            first_name='Test',
            last_name='User',
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
            first_name='Test',
            last_name='User',
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
            first_name='Test',
            last_name='User',
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
