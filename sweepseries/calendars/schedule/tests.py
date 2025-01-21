from rest_framework.test import APITestCase

from auth.user.models import User
from .models import Schedule, Event

class ScheduleAPITestCase(APITestCase):
    fixtures = ["core/data/test/users.json", "core/data/test/calendars.json"]

    def setUp(self):
        self.url = "/v1/schedules/"
        self.calendar_owner = User.objects.get(username="normaluser")
        self.calendar_viewer = User.objects.get(username="admin")
        self.base_data = {
            "calendar_id": 1,
            "title": "no alarm, no repeat",
            "description": "no alarm, no repeat",
            "start_datetime": "2025-02-01T00:00:00Z",
            "end_datetime": "2025-02-01T01:00:00Z",
            "is_allday": False,
            "alarm": {
                "use": False,
                "delta": 10,
                "unit": 1,
            },
            "color": "#000000",
            "repeat": {
                "use": False,
                "period": 1,
                "break": "",
            }
        }

    def test_create_schedule_normal(self):
        self.client.force_authenticate(user=self.calendar_owner)

        ## 1. no repeat, no alarm, not all day
        response = self.client.post(self.url, self.base_data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 1)
        self.assertEqual(Event.objects.count(), 1)

        ## 2. no repeat, alarm, all day
        data = self.base_data.copy()
        data["title"] = "alarm, all day"
        data["description"] = "alarm, all day"
        data["start_datetime"] = "2025-02-01T19:30:00Z"
        data["end_datetime"] = "2025-02-01T20:30:00Z"
        data["is_allday"] = True
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 2)
        self.assertEqual(Event.objects.count(), 2)
        event = Event.objects.get(schedule__title="alarm, all day")
        self.assertEqual(event.start_datetime.isoformat(), '2025-02-01T00:00:00')
        self.assertEqual(event.end_datetime.isoformat(), '2025-02-01T23:59:59')
        self.assertEqual(event.is_allday, True)

    def test_create_schedule_repeat(self):
        self.client.force_authenticate(user=self.calendar_owner)

        ## 1. repeat: daily + break: date
        data = self.base_data.copy()
        data["title"] = "daily repeat"
        data["description"] = "daily repeat"
        data["repeat"] = {
            "use": True,
            "period": 0,
            "break": "2025.02.07까지",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 1)
        self.assertEqual(Event.objects.count(), 7)

        ## 2. repeat: weekly + break: date
        data["title"] = "weekly repeat"
        data["description"] = "weekly repeat"
        data["repeat"] = {
            "use": True,
            "period": 1,
            "break": "2025.02.28까지",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 2)
        self.assertEqual(Event.objects.count(), 11)

        ## 3. repeat: monthly + break: date
        data["title"] = "monthly repeat"
        data["description"] = "monthly repeat"
        data["repeat"] = {
            "use": True,
            "period": 2,
            "break": "2025.12.31까지",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 3)
        self.assertEqual(Event.objects.count(), 22)

        ## 4. repeat: yearly + break: number
        data["title"] = "yearly repeat"
        data["description"] = "yearly repeat"
        data["repeat"] = {
            "use": True,
            "period": 3,
            "break": "5회",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Schedule.objects.count(), 4)
        self.assertEqual(Event.objects.count(), 27)
        last = Event.objects.last()
        self.assertEqual(last.start_datetime.isoformat(), '2029-02-01T00:00:00')

    def test_create_schedule_alarm(self):
        self.client.force_authenticate(user=self.calendar_owner)

        ## 1. alarm: minutes
        data = self.base_data.copy()
        data["title"] = "alarm minutes"
        data["description"] = "alarm minutes"
        data["alarm"] = {
            "use": True,
            "delta": 10,
            "unit": 0,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        event = Event.objects.get(schedule__title="alarm minutes")
        self.assertEqual(event.notify, True)
        self.assertEqual(event.notify_time.isoformat(), '2025-01-31T23:50:00')

        ## 2. alarm: hours
        data["title"] = "alarm hours"
        data["description"] = "alarm hours"
        data["alarm"] = {
            "use": True,
            "delta": 1,
            "unit": 1,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        event = Event.objects.get(schedule__title="alarm hours")
        self.assertEqual(event.notify_time.isoformat(), '2025-01-31T23:00:00')

        ## 3. alarm: days
        data["title"] = "alarm days"
        data["description"] = "alarm days"
        data["alarm"] = {
            "use": True,
            "delta": 3,
            "unit": 2,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        event = Event.objects.get(schedule__title="alarm days")
        self.assertEqual(event.notify_time.isoformat(), '2025-01-29T00:00:00')

        ## 4. alarm: weeks
        data["title"] = "alarm weeks"
        data["description"] = "alarm weeks"
        data["alarm"] = {
            "use": True,
            "delta": 2,
            "unit": 3,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 201)
        event = Event.objects.get(schedule__title="alarm weeks")
        self.assertEqual(event.notify_time.isoformat(), '2025-01-18T00:00:00')

    def test_create_schedule_fail(self):
        ## 1. not authenticated
        response = self.client.post(self.url, self.base_data, format="json")
        self.assertEqual(response.status_code, 403)

        ## 2. no data
        self.client.force_authenticate(user=self.calendar_owner)
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, 400)

        ## 3. start > end
        data = self.base_data.copy()
        data["start_datetime"] = "2025-02-01T01:00:00Z"
        data["end_datetime"] = "2025-02-01T00:00:00Z"
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 4. bad repeat period
        data = self.base_data.copy()
        data["repeat"] = {
            "use": True,
            "period": 4,
            "break": "2025.12.31까지",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 5. bad repeat break (number)
        data = self.base_data.copy()
        data["repeat"] = {
            "use": True,
            "period": 0,
            "break": "n회",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 6. bad repeat break (date)
        data = self.base_data.copy()
        data["repeat"] = {
            "use": True,
            "period": 0,
            "break": "yyyy.mm.dd까지",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 7. bad repeat type
        data = self.base_data.copy()
        data["repeat"] = {
            "use": True,
            "period": 0,
            "break": "2025.12.31",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 8. bad alarm unit
        data = self.base_data.copy()
        data["alarm"] = {
            "use": True,
            "delta": 10,
            "unit": 4,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, 400)

        ## 9. no auth
        self.client.force_authenticate(user=self.calendar_viewer)
        response = self.client.post(self.url, self.base_data, format="json")
        self.assertEqual(response.status_code, 400)
