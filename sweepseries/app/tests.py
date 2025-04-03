from rest_framework.test import APITestCase

class InitializerAPITestCase(APITestCase):
    def test_initializer(self):
        # This test will check if the initializer endpoint is working correctly.
        response = self.client.get('/v1/initialize/')
        self.assertEqual(response.status_code, 200)
