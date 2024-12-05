from django.conf import settings
from rest_framework.test import APITestCase

from auth.user.models import User

class FAQListAPITestCase(APITestCase):
    fixtures = ["core/data/test/faqs.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/faqs/"
        self.admin = User.objects.get(username="admin")
        self.normal_user = User.objects.get(username="normaluser")
        self.create_data = {
            "category": "예약",
            "question": "test question",
            "answer": "test answer"
        }

    def test_faq_list(self):
        ## no query
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        ## all categories
        response = self.client.get(self.url, {"category": "전체"})
        self.assertEqual(response.status_code, 200)

        ## with category
        response = self.client.get(self.url, {"category": "예약"})
        self.assertEqual(response.status_code, 200)

        ## admin
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.url, HTTP_ORIGIN=settings.ADMIN_PAGE_URL)
        self.assertEqual(response.status_code, 200)

    def test_faq_list_fail(self):
        ## invalid category
        response = self.client.get(self.url, {"category": "invalid"})
        self.assertEqual(response.status_code, 400)

    def test_faq_retrieve(self):
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, 200)

    def test_faq_create(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_faq_create_fail(self):
        ## not authenticated
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## no question
        self.client.force_authenticate(self.admin)
        data = self.create_data.copy()
        data.pop("question")
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## invalid category
        data = self.create_data.copy()
        data["category"] = "invalid"
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_faq_update(self):
        self.client.force_authenticate(self.admin)
        response = self.client.put(self.url + "1/", self.create_data)
        self.assertEqual(response.status_code, 200)

    def test_faq_update_fail(self):
        ## not authenticated
        response = self.client.put(self.url + "1/", self.create_data)
        self.assertEqual(response.status_code, 403)

        ## no question
        self.client.force_authenticate(self.admin)
        data = self.create_data.copy()
        data.pop("question")
        response = self.client.put(self.url + "1/", data)
        self.assertEqual(response.status_code, 400)

        ## no answer
        data = self.create_data.copy()
        data.pop("answer")
        response = self.client.put(self.url + "1/", data)
        self.assertEqual(response.status_code, 400)

    def test_faq_delete(self):
        self.client.force_authenticate(self.admin)
        response = self.client.delete(self.url + "1/")
        self.assertEqual(response.status_code, 204)
