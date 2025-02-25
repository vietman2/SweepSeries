from django.test import TestCase
from rest_framework.test import APITestCase

from auth.user.models import User
from .models import Todo

class TodosAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/todos/"
        self.user = User.objects.get(username="normaluser")
        self.another_user = User.objects.get(username="user4")
        self.create_data = {
            "calendar_id": 1,
            "title": "할 일 생성 테스트",
            "deadline": "2021-01-01",
            "color": "#ffffff"
        }
        Todo.objects.create(
            user=self.user,
            title="할 일 1",
            deadline="2025-02-01",
            color="#ffffff",
        )

    def test_unallowed_methods(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url + "1/")
        self.assertEqual(response.status_code, 405)
 
    def test_create_todo(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## no auth: not logged in
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## no data
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {})
        self.assertEqual(response.status_code, 400)

    def test_toggle_todo(self):
        todo = Todo.objects.get(pk=1)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}{todo.id}/toggle/")
        self.assertEqual(response.status_code, 200)

    def test_toggle_fail(self):
        ## no auth
        todo = Todo.objects.get(pk=1)
        self.client.force_authenticate(user=self.another_user)
        response = self.client.patch(f"{self.url}{todo.id}/toggle/")
        self.assertEqual(response.status_code, 403)

    def test_model_str(self):
        todo = Todo.objects.get(pk=1)
        self.assertEqual(str(todo), "할 일 1")
