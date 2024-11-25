from rest_framework import status
from rest_framework.test import APITestCase

class AgreementsAPITestCase(APITestCase):
    fixtures = ["core/data/test/agreements.json"]

    def setUp(self):
        self.url = "/v1/agreements/"

    def test_agreements_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_agreements_retrieve(self):
        response = self.client.get(self.url + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
