from datetime import datetime, timedelta
from django.test import TestCase

from ..models import Program
from ..utils import get_available_times

class AvailableTimesTestCase(TestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/test/coaches.json",
        "core/data/test/programs.json", "core/data/initial/facilities.json",
        "core/data/initial/programs.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/test/contracts.json",
        "core/data/initial/reviewtags.json",
    ]

    def test_get_academy_available_times(self):
        program = Program.objects.get(pk=1)
        team = program.teams.first()
        date = datetime.strptime("2025-03-09", "%Y-%m-%d")

        ## Case 1: Academy is closed
        times = get_available_times(program, team, date)
        self.assertEqual(times, None)

        ## Case 2: CoathTeam Select is Disabled
        times = get_available_times(program, team, date + timedelta(days=1))
        self.assertEqual(len(times), 25)

        program = Program.objects.get(pk=2)
        team = program.teams.first()

        ## Case 3 is handled in API Testing

        ## Case 4: CoathTeam Select is Enabled (Coach off)
        times = get_available_times(program, team, date - timedelta(days=1))
        self.assertEqual(len(times), 26)

        ## Case 5: CoathTeam Select is Enabled (Start Late)
        times = get_available_times(program, team, date - timedelta(days=2))
        self.assertEqual(len(times), 25)

        ## Case 6: CoathTeam Select is Enabled (Leave Early)
        times = get_available_times(program, team, date - timedelta(days=3))
        self.assertEqual(len(times), 25)

        ## Case 7: CoathTeam Select is Enabled (Full time + has booked session)
        times = get_available_times(program, team, date - timedelta(days=4))
        self.assertEqual(len(times), 25)
