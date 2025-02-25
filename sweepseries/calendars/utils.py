from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from product.academy.models import Academy, AcademyStudent
from product.coach.models import Coach
from product.lesson.utils import get_monthly_sessions, get_daily_sessions
from .diary.models import Diary
from .schedule.utils import get_monthly_events, get_daily_events
from .todo.utils import get_todos

def check_personal_calendar_permissions(user, uuid):
    if uuid is None:
        return False

    if str(user.uuid) == uuid:
        return True

    return False

def check_academy_calendar_permissions(user, uuid):
    try:
        academy = Academy.objects.get(uuid=uuid)
    except ObjectDoesNotExist:
        return None

    if academy.owner == user:
        return "OWNER"

    if academy.students.filter(person=user.person).exists():
        return "STUDENT"

    if academy.coaches.filter(person__user=user).exists():
        return "COACH"

    return None

def get_dates_from_month(month_query):
    ## month is given in format 'YYYY-MM'
    month = month_query.split('-')[1]
    year = month_query.split('-')[0]

    try:
        month = int(month)
        year = int(year)
        start_date = datetime(year, month, 1)
        end_date = start_date + relativedelta(months=1)
    except ValueError as e:
        raise ValidationError("올바른 형식이 아닙니다.") from e

    tz = timezone.get_current_timezone()
    start_date = timezone.make_aware(start_date, tz)
    end_date = timezone.make_aware(end_date, tz)

    return start_date, end_date

def get_personal_monthly_calendar_data(user, month_query, uuid=None):
    if not check_personal_calendar_permissions(user, uuid):
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        data = defaultdict(list)

        start_date, end_date = get_dates_from_month(month_query)

        data = get_monthly_sessions(data, user, start_date, end_date, 'personal') ## 레슨 세션
        data = get_monthly_events(data, user, start_date, end_date) ## 개인 일정

        return Response(data, status=status.HTTP_200_OK)
    except ValidationError as e:
        return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def get_personal_daily_calendar_data(user, date_query, uuid=None):
    ## 개인 일간 조회는 개인 일정, 레슨, 할일, 다이어리 모두 반환해야 한다.
    if not check_personal_calendar_permissions(user, uuid):
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        date_obj = datetime.fromisoformat(date_query)
    except ValueError as e:
        return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    tz = timezone.get_current_timezone()
    date_obj = timezone.make_aware(date_obj, tz)

    lessons = get_daily_sessions(user, date_obj, 'personal')
    events = get_daily_events(user, date_obj)
    todos = get_todos(user, date_obj)
    diary = Diary.objects.filter(user=user, date=date_obj).first()

    data = {
        "events": events,
        "lessons": lessons,
        "todos": todos,
        "diary": diary.diary if diary else "",
    }

    return Response(data, status=status.HTTP_200_OK)

def get_academy_monthly_calendar_data(academy_uuid, user, month_query, uuid=None):
    role = check_academy_calendar_permissions(user, uuid)
    if role is None:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        data = defaultdict(list)

        academy = Academy.objects.get(uuid=academy_uuid)
        start_date, end_date = get_dates_from_month(month_query)

        data = get_monthly_sessions(data, user, start_date, end_date, role, academy) ## 레슨 세션
        data = get_monthly_events(data, user, start_date, end_date, academy) ## 아카데미 일정

        return Response(data, status=status.HTTP_200_OK)
    except ValidationError as e:
        return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

def get_academy_daily_calendar_data(academy_uuid, user, date_query, uuid=None):
    role = check_academy_calendar_permissions(user, uuid)
    if role is None:
        return Response(status=status.HTTP_403_FORBIDDEN)

    try:
        date_obj = datetime.fromisoformat(date_query)
    except ValueError as e:
        return Response(data={"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    tz = timezone.get_current_timezone()
    date_obj = timezone.make_aware(date_obj, tz)

    academy = Academy.objects.get(uuid=academy_uuid)

    lessons = get_daily_sessions(user, date_obj, role, academy)
    events = get_daily_events(user, date_obj, academy)

    data = {
        "events": events,
        "lessons": lessons,
    }

    return Response(data, status=status.HTTP_200_OK)

def toggle_academy_calendar_notifications(academy_uuid, user, role):
    if role == "OWNER":
        academy = Academy.objects.get(uuid=academy_uuid)
        academy.notifications = not academy.notifications
        academy.save()
    elif role == "STUDENT":
        student = AcademyStudent.objects.get(academy__uuid=academy_uuid, person__user=user)
        student.notifications = not student.notifications
        student.save()
    else:
        coach = Coach.objects.get(person__user=user)
        coach.notifications = not coach.notifications
        coach.save()

def toggle_academy_calendar_daily_notifications(academy_uuid, user, role, time=None):
    if role == "OWNER":
        academy = Academy.objects.get(uuid=academy_uuid)
        if academy.notifications_today:
            academy.daily_time = None
            academy.notifications_today = False
        else:
            if time:
                academy.notifications_today = True
                academy.daily_time = time
            else:
                raise ValidationError("시간을 지정해주세요.")
        academy.save()
    elif role == "STUDENT":
        student = AcademyStudent.objects.get(academy__uuid=academy_uuid, person__user=user)
        if student.notifications_today:
            student.daily_time = None
            student.notifications_today = False
        else:
            if time:
                student.notifications_today = True
                student.daily_time = time
            else:
                raise ValidationError("시간을 지정해주세요.")
        student.save()
    else:
        coach = Coach.objects.get(person__user=user)
        if coach.notifications_today:
            coach.daily_time = None
            coach.notifications_today = False
        else:
            if time:
                coach.notifications_today = True
                coach.daily_time = time
            else:
                raise ValidationError("시간을 지정해주세요.")
        coach.save()

def toggle_personal_daily_notifications(user, time=None):
    ## toggle daily notifications
    if user.notifications_today:
        user.notifications_today = False
        user.daily_time = None
        user.save()

        return True

    if time:
        user.notifications_today = True
        user.daily_time = time
        user.save()

        return True

    return False
