from rest_framework.test import APITestCase

from .models import User

class CalendarAPITestCase(APITestCase):
    fixtures = ['core/data/test/users.json', 'core/data/test/calendars.json']

    def setUp(self):
        self.user = User.objects.get(username='normaluser')
        self.client.force_authenticate(user=self.user)
        self.url = '/v1/calendars/'

    def test_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
