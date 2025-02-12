from rest_framework.test import APITestCase

from auth.user.models import User

class InquiryAPITestCase(APITestCase):
    fixtures = ["core/data/test/inquiries.json", "core/data/test/users.json"]

    def setUp(self):
        self.url = "/v1/inquiries/"
        self.user1 = User.objects.get(username="admin")
        self.user2 = User.objects.get(username="normaluser")
        self.create_data = {
            "title": "test",
            "description": "test content"
        }

    def test_inquiries_list(self):
        ## 1. Not authenticated
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 403)

        self.client.force_authenticate(self.user1)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)

        self.client.force_authenticate(self.user2)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

    def test_inquiries_retrieve(self):
        self.client.force_authenticate(self.user1)
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, 405)

    def test_inquiries_create(self):
        ## 1. normal
        self.client.force_authenticate(self.user1)
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_inquiries_create_fail(self):
        ## 1. Not authenticated
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 403)

        ## 2. Not valid data
        self.client.force_authenticate(self.user1)
        response = self.client.post(self.url, {"title": "test"})
        self.assertEqual(response.status_code, 400)
