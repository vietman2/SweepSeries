import datetime
from django.core.exceptions import ValidationError
from django.test import TestCase

from ..models import Academy, BusinessHours, SpecialDay
from ..utils import get_operating_hours

class AcademyOperatingHoursTestCase(TestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
    ]

    def setUp(self):
        self.academy = Academy.objects.get(name="아카데미 1")
        self.date = datetime.date(2025, 1, 1)

    def test_get_operating_hours(self):
        ## 1. Normal Case
        result = get_operating_hours(self.academy, self.date)
        self.assertEqual(result[0], datetime.time(9, 30))

        ## 2. Is Closed
        sunday = datetime.date(2025, 3, 9)
        result = get_operating_hours(self.academy, sunday)
        self.assertEqual(result, None)

        ## 3. Is Allday
        saturday = datetime.date(2025, 3, 8)
        sat_hours = BusinessHours.objects.get(academy=self.academy, day_of_week=5)
        sat_hours.is_allday = True
        sat_hours.is_closed = False
        sat_hours.save()
        result = get_operating_hours(self.academy, saturday)
        self.assertEqual(result[0], datetime.time(0, 0))

        ## 4. Special Day
        special_day = datetime.date(2025, 3, 1)
        SpecialDay.objects.create(
            academy=self.academy, date=special_day, is_closed=False
        )
        result = get_operating_hours(self.academy, special_day)
        self.assertEqual(result[0], datetime.time(9, 0))

        ## 5. Special Day is Closed
        another_day = datetime.date(2025, 3, 2)
        SpecialDay.objects.create(
            academy=self.academy, date=another_day, is_closed=True
        )
        result = get_operating_hours(self.academy, another_day)
        self.assertEqual(result, None)

    def test_get_operating_hours_fail(self):
        ## No Business Hours
        BusinessHours.objects.all().delete()
        result = get_operating_hours(self.academy, self.date)
        self.assertEqual(result, None)

    def test_validation_error(self):
        bad_time = datetime.time(9, 15)

        day = SpecialDay.objects.create(
            academy=self.academy, date=self.date, is_closed=False, start_time=bad_time
        )
        with self.assertRaises(ValidationError):
            day.full_clean()
