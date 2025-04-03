from django.conf import settings
from django.test import TestCase
from rest_framework.test import APITestCase

from auth.user.models import User
from .models import Notice

class NoticesAPITestCase(APITestCase):
    fixtures = ["core/data/test/notices.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/notices/"
        self.admin = User.objects.get(username="admin")
        self.normal_user = User.objects.get(username="normaluser")
        self.create_data = {
            "title": "test",
            "content": "test content"
        }
        self.update_data = {
            "title": "updated",
            "content": "updated content",
        }

    def test_notices_list(self):
        ## 1. Not authenticated
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        ## 2. normal user
        self.client.force_authenticate(self.normal_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        ## 3. admin from admin page
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_notices_retrieve(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, 200)

    def test_notices_create(self):
        ## 1. normal
        self.client.force_authenticate(self.admin)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_notices_create_fail(self):
        ## 1. not authenticated
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## 2. no content
        self.client.force_authenticate(self.admin)
        data = self.create_data.copy()
        data.pop("content")
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_notices_update(self):
        self.client.force_authenticate(self.admin)
        response = self.client.put(self.url + "1/", self.update_data)
        self.assertEqual(response.status_code, 200)

    def test_notices_update_fail(self):
        ## 1. not authenticated
        response = self.client.put(self.url + "1/", self.update_data)
        self.assertEqual(response.status_code, 403)

        ## 2. no content
        self.client.force_authenticate(self.admin)
        data = self.update_data.copy()
        data.pop("content")
        response = self.client.put(self.url + "1/", data)
        self.assertEqual(response.status_code, 400)

        ## 3. no title
        data = self.update_data.copy()
        data.pop("title")
        response = self.client.put(self.url + "1/", data)
        self.assertEqual(response.status_code, 400)

    def test_notices_destroy(self):
        self.client.force_authenticate(self.admin)
        response = self.client.delete(self.url + "1/")
        self.assertEqual(response.status_code, 204)

    def test_notices_destroy_fail(self):
        ## 1. not authenticated
        response = self.client.delete(self.url + "1/")
        self.assertEqual(response.status_code, 403)

class NoticeModelTestCase(TestCase):
    fixtures = ["core/data/test/notices.json", "core/data/test/users.json"]

    def test_notice_str(self):
        notice = Notice.objects.get(id=1)
        self.assertEqual(str(notice), notice.title)
