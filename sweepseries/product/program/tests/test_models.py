from django.test import TestCase

from ..models import Target, Position

class ProgramModelsTestCase(TestCase):
    fixtures = ["core/data/initial/programs.json"]

    def test_target_str(self):
        target = Target.objects.get(id=1)
        self.assertEqual(str(target), "선수반")

    def test_position_str(self):
        position = Position.objects.get(id=1)
        self.assertEqual(str(position), "투수레슨")
