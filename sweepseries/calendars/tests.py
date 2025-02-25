from rest_framework.test import APITestCase

from auth.user.models import User

class CalendarsAPITestCase(APITestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/calendar.json",
        "core/data/test/academies.json", "core/data/initial/regions.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/programs.json",
    ]

    def setUp(self):
        self.url = "/v1/calendars/"
        self.user = User.objects.get(username="admin")
        self.academy_owner = User.objects.get(username="normaluser")
        self.coach = User.objects.get(username="coachuser")
        self.not_allowed_user = User.objects.get(username="user4")

    def test_unallowed_methods(self):
        ## retrieve
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

        ## update
        response = self.client.patch(f"{self.url}1/")
        self.assertEqual(response.status_code, 405)

    def test_list_calendars(self):
        ## list calendars

        ## personal + academy (as student)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        ## personal + academy (as owner)
        self.client.force_authenticate(user=self.academy_owner)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

        ## personal + academy (as coach)
        self.client.force_authenticate(user=self.coach)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)

    def test_monthly_calendar(self):
        ## monthly calendar

        ## no month
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}monthly/")
        self.assertEqual(response.status_code, 400)

        ## no uuid
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "personal",
            }
        )
        self.assertEqual(response.status_code, 403)

        ## success (personal)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "personal",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 200)

        ## no uuid
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-01",
                "type": "academy",
            }
        )
        self.assertEqual(response.status_code, 403)

        ## success (academy student)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "academy",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 200)

        ## success (academy owner)
        self.client.force_authenticate(user=self.academy_owner)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "academy",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_monthly_calendar_fail(self):
        ## no auth (personal)
        self.client.force_authenticate(user=self.not_allowed_user)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "personal",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 403)

        ## no auth (academy)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "2025-02",
                "type": "academy",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 403)

        ## bad params (personal)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "asdf-qw",
                "type": "personal",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 400)

        ## bad params (academy)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "asdf-qw",
                "type": "academy",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 400)

        ## bad type (academy)
        response = self.client.get(
            f"{self.url}monthly/",
            {
                "month": "asdf-qw",
                "type": "qwer",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 400)

    def test_daily_calendar(self):
        ## daily calendar

        ## no type
        self.client.force_authenticate(user=self.user)
        response = self.client.get(f"{self.url}daily/")
        self.assertEqual(response.status_code, 400)

        ## success (personal)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "personal",
                "date": "2025-01-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 200)

        ## success (academy student)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "academy",
                "date": "2025-02-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 200)

        ## success (academy owner)
        self.client.force_authenticate(user=self.academy_owner)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "academy",
                "date": "2025-02-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 200)

    def test_daily_calendar_fail(self):
        ## no auth (personal)
        self.client.force_authenticate(user=self.not_allowed_user)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "personal",
                "date": "2025-01-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 403)

        ## no auth (academy)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "academy",
                "date": "2025-01-01",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 403)

        ## bad params (personal)
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "personal",
                "date": "asdf-qw-er",
                "uuid": "123e4567-e89b-12d3-a456-426614174000"
            }
        )
        self.assertEqual(response.status_code, 400)

        ## bad params (academy)
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "academy",
                "date": "asdf-qw-er",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 400)

        ## bad type
        response = self.client.get(
            f"{self.url}daily/",
            {
                "type": "qwer",
                "date": "asdf-qw-er",
                "uuid": "123e4567-e89b-12d3-a456-426614174999"
            }
        )
        self.assertEqual(response.status_code, 400)

    def test_calendar_info_update(self):
        ## update calendar info

        ## no data
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}info/")
        self.assertEqual(response.status_code, 400)

        ## success (title)
        data = {
            "title": "new title",
        }
        response = self.client.patch(f"{self.url}info/", data)
        self.assertEqual(response.status_code, 200)

        ## success (color)
        data = {
            "color": "#123456",
        }
        response = self.client.patch(f"{self.url}info/", data)
        self.assertEqual(response.status_code, 200)

    def test_toggle_notification(self):
        ## toggle notifications

        ## no data
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}notifications/")
        self.assertEqual(response.status_code, 400)

        ## success (personal)
        data = {
            "type": "personal",
        }
        response = self.client.patch(f"{self.url}notifications/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## success (academy: student)
        data = {
            "type": "academy",
            "uuid": "123e4567-e89b-12d3-a456-426614174999"
        }
        response = self.client.patch(f"{self.url}notifications/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## success (academy: coach)
        self.client.force_authenticate(user=self.coach)
        response = self.client.patch(f"{self.url}notifications/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## success (academy: owner)
        self.client.force_authenticate(user=self.academy_owner)
        response = self.client.patch(f"{self.url}notifications/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## failure (academy: no auth)
        self.client.force_authenticate(user=self.not_allowed_user)
        response = self.client.patch(f"{self.url}notifications/", data, format="json")
        self.assertEqual(response.status_code, 403)

    def test_toggle_daily_notification_personal(self):
        ## toggle daily notifications

        ## no data
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}dailynoti/")
        self.assertEqual(response.status_code, 400)

        ## success (personal)
        ## switch off
        data = {
            "type": "personal",
        }
        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 200)
        ## switch on fail
        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 400)
        ## switch on success
        data = {
            "type": "personal",
            "time": "12:00"
        }
        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 200)

    def test_toggle_daily_notification_academy(self):
        no_time_data = {
            "type": "academy",
            "uuid": "123e4567-e89b-12d3-a456-426614174999",
        }
        data = {
            "type": "academy",
            "uuid": "123e4567-e89b-12d3-a456-426614174999",
            "time": "12:00"
        }

        ## academy: student
        self.client.force_authenticate(user=self.user)
        ## switch off success
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 200)

        ## switch on fail: no time
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 400)

        ## switch on success
        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## academy: coach
        self.client.force_authenticate(user=self.coach)
        ## switch off success
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 200)

        ## fail: no time
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 400)

        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## academy: owner
        self.client.force_authenticate(user=self.academy_owner)
        ## switch off success
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 200)

        ## fail: no time
        response = self.client.patch(f"{self.url}dailynoti/", no_time_data, format="json")
        self.assertEqual(response.status_code, 400)

        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## failure (academy: no auth)
        self.client.force_authenticate(user=self.not_allowed_user)
        response = self.client.patch(f"{self.url}dailynoti/", data, format="json")
        self.assertEqual(response.status_code, 403)

    def test_switch_scope(self):
        ## switch calendar scope

        ## no data
        self.client.force_authenticate(user=self.academy_owner)
        response = self.client.patch(f"{self.url}scope/")
        self.assertEqual(response.status_code, 400)

        ## success
        data = {
            "scope": 2,
            "uuid": "123e4567-e89b-12d3-a456-426614174999"
        }
        response = self.client.patch(f"{self.url}scope/", data, format="json")
        self.assertEqual(response.status_code, 200)

        ## no auth
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"{self.url}scope/", data, format="json")
        self.assertEqual(response.status_code, 403)
