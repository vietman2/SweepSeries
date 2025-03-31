from django.db.models import Avg, Q
from django.utils import timezone

from product.academy.models import Academy
from product.coach.models import Coach
from product.contract.models import Contract, Review
from product.lesson.models import Session
from product.program.models import Program

def check_for_finished_sessions():
    """
        DB 전체에서 종료된 세션이 있는지 확인하고, 체크하기.
        DB에 데이터 정합성이 깨지는 경우, 이 함수를 실행하여 수정한다.
    """
    contracts = Contract.objects.all()
    datetime_now = timezone.now()

    for contract in contracts:
        sessions = contract.sessions.all()
        num_completed = 0

        if sessions.count() == 0:
            continue

        for session in sessions:
            if session.end_datetime < datetime_now:
                num_completed += 1

        contract.completed_lessons = num_completed
        contract.scheduled_lessons = len(sessions)
        contract.save()

def check_for_finished_sessions_today():
    """
        오늘 날짜에 종료된 세션이 있는지 확인하고, 체크하기.
        매일 11시 50분에 실행되도록 스케줄링한다.
    """
    today = timezone.now().date()

    q = Q(end_datetime__date=today)
    sessions = Session.objects.filter(q)

    for session in sessions:
        session.contract.completed_lessons += 1
        session.contract.save()

def update_academy_ratings():
    """
        DB 전체에서 아카데미 평점을 업데이트한다.
    """
    academies = Academy.objects.all()

    for academy in academies:
        q = Q(contract__curriculum__program__academy=academy)
        reviews = Review.objects.filter(q)
        num_reviews = len(reviews)
        if num_reviews == 0:
            continue

        total_rating = 0

        for review in reviews:
            total_rating += review.academy_rating

        academy.cached_rating = total_rating / num_reviews
        academy.num_reviews = num_reviews
        academy.save()

def update_coach_ratings():
    """
        DB 전체에서 코치 평점을 업데이트한다.
    """
    coaches = Coach.objects.all()

    for coach in coaches:
        sessions = Session.objects.filter(coaches=coach)
        contracts = sessions.values_list('contract', flat=True).distinct()
        reviews = Review.objects.filter(contract__in=contracts)

        review_avg = reviews.aggregate(avg=Avg('coach_rating'))['avg']
        if review_avg is not None:
            coach.cached_rating = review_avg
            coach.num_reviews = len(reviews)
            coach.save()

def update_program_ratings():
    """
        DB 전체에서 프로그램 평점을 업데이트한다.
    """
    programs = Program.objects.all()

    for program in programs:
        q = Q(contract__curriculum__program=program)
        reviews = Review.objects.filter(q)

        review_avg = reviews.aggregate(avg=Avg('lesson_rating'))['avg']
        if review_avg is not None:
            program.cached_rating = review_avg
            program.num_reviews = len(reviews)
            program.save()
