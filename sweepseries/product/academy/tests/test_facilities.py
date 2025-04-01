from rest_framework.test import APITestCase

class FacilityTestCase(APITestCase):
    fixtures = ["core/data/initial/facilities.json"]

    def setUp(self):
        self.url = "/v1/facilities/"

    def test_facility_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_facility_detail(self):
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)
