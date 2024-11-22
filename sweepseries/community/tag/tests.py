from rest_framework.test import APITestCase

class TagAPITest(APITestCase):
    fixtures = ['core/data/test/tags.json']

    def test_list(self):
        response = self.client.get('/api/community/tags/')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/community/tags/1/')
        self.assertEqual(response.status_code, 405)
