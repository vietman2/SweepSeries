import datetime
from django.test import TestCase

from ..models import Coach, CoachWorkingHours, SpecialWorkingDay
from ..utils import get_working_hours

class WorkingHoursTestCase(TestCase):
    fixtures = [
        "core/data/initial/professions.json", "core/data/test/coaches.json",
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json"
    ]

    def setUp(self):
        self.coach = Coach.objects.all().first()
        self.date = datetime.date(2021, 1, 1)
        self.off_date = datetime.date(2025, 3, 9)

    def test_get_working_hours(self):
        ## 1. no special day
        working_hours = get_working_hours(self.coach, self.date)
        self.assertEqual(working_hours, (datetime.time(9, 0), datetime.time(21, 0)))

        ## 2. special day
        special_day = SpecialWorkingDay.objects.create(
            coach=self.coach,
            date=self.date,
            start_time=datetime.time(10, 0),
            end_time=datetime.time(17, 0)
        )
        working_hours = get_working_hours(self.coach, self.date)
        self.assertEqual(working_hours, (datetime.time(10, 0), datetime.time(17, 0)))

        ## 3. special day off
        special_day.is_off = True
        special_day.save()
        working_hours = get_working_hours(self.coach, self.date)
        self.assertEqual(working_hours, None)

        ## 4. working hour off
        special_day.is_off = False
        special_day.save()
        working_hours = get_working_hours(self.coach, self.off_date)
        self.assertEqual(working_hours, None)

        ## 5. no working hour
        CoachWorkingHours.objects.all().delete()
        working_hours = get_working_hours(self.coach, self.off_date)
        self.assertEqual(working_hours, None)
