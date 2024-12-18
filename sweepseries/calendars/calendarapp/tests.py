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

    def test_retrieve(self):
        response = self.client.get(f'{self.url}1/')
        self.assertEqual(response.status_code, 200)

    def test_partial_update(self):
        ## 1. name
        response = self.client.patch(f'{self.url}1/', {'name': 'new name'})
        self.assertEqual(response.status_code, 200)

        ## 2. color
        response = self.client.patch(f'{self.url}1/', {'color': '#FFFFFF'})
        self.assertEqual(response.status_code, 200)

    def test_partial_update_fail(self):
        response = self.client.patch(f'{self.url}1/', {})
        self.assertEqual(response.status_code, 400)

    def test_toggle_notification(self):
        ## 1. turn off
        response = self.client.patch(f'{self.url}1/notification/')
        self.assertEqual(response.status_code, 200)

        ## 2. turn on
        response = self.client.patch(f'{self.url}1/notification/')
        self.assertEqual(response.status_code, 200)

    def test_toggle_daily_notification(self):
        ## 1. turn off
        response = self.client.patch(f'{self.url}1/daily/', {'time': '09:30:00'})
        self.assertEqual(response.status_code, 200)

        ## 2. turn on
        response = self.client.patch(f'{self.url}1/daily/', {'time': '09:30:00'})
        self.assertEqual(response.status_code, 200)

    def test_toggle_daily_fail(self):
        response = self.client.patch(f'{self.url}1/daily/', {})
        self.assertEqual(response.status_code, 400)
