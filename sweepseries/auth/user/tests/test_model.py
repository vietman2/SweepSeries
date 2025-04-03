from django.contrib.admin import AdminSite
from django.test import TestCase, RequestFactory

from auth.person.models import Person
from ..forms import UserAdmin, CustomUserCreationForm
from ..models import User

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
