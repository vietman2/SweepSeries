from rest_framework.test import APITestCase

from .models import User

class CalendarAPITestCase(APITestCase):
    fixtures = ['core/data/test/users.json', 'core/data/test/calendars.json']

    def setUp(self):
        self.user = User.objects.get(username='normaluser')
        self.admin = User.objects.get(username='admin')
        self.client.force_authenticate(user=self.user)
        self.url = '/v1/calendars/'

    def test_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_retrieve(self):
        response = self.client.get(f'{self.url}1/')
        self.assertEqual(response.status_code, 200)

    def test_create(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, 201)

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

    def test_delete(self):
        ## 1. delete as owner
        response = self.client.delete(f'{self.url}1/')
        self.assertEqual(response.status_code, 204)

    def test_delete_fail(self):
        ## no permission
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f'{self.url}1/')
        self.assertEqual(response.status_code, 403)

    def test_leave(self):
        response = self.client.delete(f'{self.url}1/leave/')
        self.assertEqual(response.status_code, 204)

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

class ScheduleAPITestCase(APITestCase):
    fixtures = [
        'core/data/test/users.json', 'core/data/test/calendars.json',
        'core/data/test/schedules.json', 'core/data/test/coaches.json',
        'core/data/test/programs.json', 'core/data/test/academies.json',
        'core/data/initial/regions.json', 'core/data/initial/professions.json',
    ]

    def setUp(self):
        self.user = User.objects.get(username='normaluser')
        self.client.force_authenticate(user=self.user)
        self.url = '/v1/calendars/1/schedules/'

    def test_monthly_schedules(self):
        response = self.client.get(self.url, {'month': '2025-02'})
        self.assertEqual(response.status_code, 200)

    def test_daily_schedules(self):
        ## with data
        response = self.client.get(self.url, {'day': '2025-02-01'})
        self.assertEqual(response.status_code, 200)

        ## without data
        response = self.client.get(self.url, {'day': '2025-02-02'})
        self.assertEqual(response.status_code, 200)

    def test_schedules_fail(self):
        ## 1. no query
        response = self.client.get(self.url, {})
        self.assertEqual(response.status_code, 400)

        ## 2. bad query: both month and day
        response = self.client.get(self.url, {'month': '2025-02', 'day': '2025-02-01'})
        self.assertEqual(response.status_code, 400)

        ## 3. bad query: bad month query
        response = self.client.get(self.url, {'month': '2025-13'})
        self.assertEqual(response.status_code, 400)

        response = self.client.get(self.url, {'month': 'qwer-qw'})
        self.assertEqual(response.status_code, 400)

        ## 4. bad query: bad day query
        response = self.client.get(self.url, {'day': '2025-02-32'})
        self.assertEqual(response.status_code, 400)

        response = self.client.get(self.url, {'day': 'qwer-qw-qw'})
        self.assertEqual(response.status_code, 400)
