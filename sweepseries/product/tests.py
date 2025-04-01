from unittest.mock import patch
from django.db.models import F, Q
from django.test import TestCase
from django.utils import timezone

from auth.person.models import Person
from product.coach.models import Coach
from product.contract.models import Contract
from product.lesson.models import Session
from product.program.models import Curriculum
from .utils import (
    check_for_finished_sessions, check_for_finished_sessions_today,
    update_academy_ratings, update_coach_ratings, update_program_ratings,
)

class CheckSessionsTestCase(TestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/initial/programs.json",
        "core/data/test/programs.json", "core/data/initial/reviewtags.json",
        "core/data/test/contracts.json",
    ]

    def setUp(self):
        ## Create a contract with no lesson for coverage
        person = Person.objects.get(pk=1)
        curriculum = Curriculum.objects.get(pk=1)
        Contract.objects.create(customer=person, curriculum=curriculum)

    def test_check_for_finished_sessions(self):
        ## check for any contracts with completed lessons < scheduled lessons
        q = Q(completed_lessons__lt=F("scheduled_lessons"))
        contracts_incomplete = Contract.objects.filter(q)
        self.assertEqual(contracts_incomplete.count(), 1)

        check_for_finished_sessions()

        ## 줄어들어야한다.
        contracts_incomplete = Contract.objects.filter(q)
        self.assertEqual(contracts_incomplete.count(), 0)

    @patch("django.utils.timezone.now")
    def test_check_for_finished_sessions_no_update(self, mock_now):
        ## 날짜가 지나지 않았으면, 업데이트 되지 않아야한다.
        today = timezone.datetime(2020, 2, 1, 23, 55, 0)
        mock_now.return_value = timezone.make_aware(today)
        q = Q(completed_lessons__lt=F("scheduled_lessons"))

        contracts_incomplete = Contract.objects.filter(q)
        self.assertNotEqual(contracts_incomplete.count(), 0)

        check_for_finished_sessions()

        ## 줄어들지 않아야 한다.
        contracts_incomplete = Contract.objects.filter(q)
        self.assertNotEqual(contracts_incomplete.count(), 0)

    @patch("django.utils.timezone.now")
    def test_check_for_finished_sessions_today(self, mock_now):
        today = timezone.datetime(2025, 2, 1, 23, 55, 0)
        mock_now.return_value = timezone.make_aware(today)
        session = Session.objects.get(pk=1)

        self.assertEqual(session.contract.completed_lessons, 0)

        check_for_finished_sessions_today()

        ## 줄어들어야한다.
        session = Session.objects.get(pk=1)
        self.assertEqual(session.contract.completed_lessons, 1)

class UpdateRatingsTestCase(TestCase):
    fixtures = [
        "core/data/test/users.json", "core/data/initial/regions.json",
        "core/data/test/academies.json", "core/data/initial/facilities.json",
        "core/data/test/coaches.json", "core/data/initial/professions.json",
        "core/data/test/lessons.json", "core/data/initial/programs.json",
        "core/data/test/programs.json", "core/data/initial/reviewtags.json",
        "core/data/test/contracts.json",
    ]

    def test_update_academy_ratings(self):
        academy = Contract.objects.get(pk=1).curriculum.program.academy
        self.assertEqual(academy.cached_rating, 0.0)

        update_academy_ratings()

        academy = Contract.objects.get(pk=1).curriculum.program.academy
        self.assertEqual(academy.cached_rating, 4.0)

    def test_update_coach_ratings(self):
        coach = Coach.objects.get(pk="923e4567-e89b-12d3-a456-426614174999")
        self.assertEqual(coach.cached_rating, 0.0)
        self.assertEqual(coach.num_reviews, 0)

        update_coach_ratings()

        coach = Coach.objects.get(pk="923e4567-e89b-12d3-a456-426614174999")
        self.assertEqual(coach.cached_rating, 3.0)
        self.assertEqual(coach.num_reviews, 1)

    def test_update_program_ratings(self):
        program = Contract.objects.get(pk=1).curriculum.program
        self.assertEqual(program.cached_rating, 0.0)
        self.assertEqual(program.num_reviews, 0)

        update_program_ratings()

        program = Contract.objects.get(pk=1).curriculum.program
        self.assertEqual(program.cached_rating, 4.0)
        self.assertEqual(program.num_reviews, 1)
