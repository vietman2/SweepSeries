from django.test import TestCase

from ..models import AcademyFacility, Academy

class AcademyModelsTestCase(TestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/test/academies.json",
        "core/data/initial/regions.json", "core/data/initial/facilities.json",
    ]

    def test_academy_facility_str(self):
        academy_facility = AcademyFacility.objects.get(id=1)
        self.assertEqual(str(academy_facility), "wifi (편의시설)")

    def test_academy_str(self):
        academy = Academy.objects.get(name="아카데미 1")
        self.assertEqual(str(academy), "아카데미 1")
