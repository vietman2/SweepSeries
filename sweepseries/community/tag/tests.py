from rest_framework.test import APITestCase

class TagAPITest(APITestCase):
    fixtures = ['core/data/test/tags.json']

    def setUp(self):
        self.url = '/api/community/tags/'
        self.create_data = {
            "forum_name": "덕아웃",
            "name": "test",
            "icon": "https://example.com/icon.png",
            "color": "#000000",
            "bgcolor": "#ffffff",
        }

    def test_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_retrieve(self):
        response = self.client.get(self.url + '1/')
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        response = self.client.post(self.url, self.create_data)
        self.assertEqual(response.status_code, 201)

    def test_create_fail(self):
        ## 1. forum_name이 없을 경우
        data = self.create_data.copy()
        data.pop('forum_name')
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

        ## 2. forum_name 값이 잘못된 경우
        data['forum_name'] = 'invalid'
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, 400)

    def test_update(self):
        response = self.client.put(self.url + '1/', self.create_data)
        self.assertEqual(response.status_code, 200)

    def test_update_fail(self):
        ## 1. forum_name이 없을 경우
        data = self.create_data.copy()
        data.pop('forum_name')
        response = self.client.put(self.url + '1/', data)
        self.assertEqual(response.status_code, 400)

    def test_partial_update(self):
        response = self.client.patch(self.url + '1/', self.create_data)
        self.assertEqual(response.status_code, 405)

    def test_delete(self):
        response = self.client.delete(self.url + '1/')
        self.assertEqual(response.status_code, 204)
