from collections import defaultdict
from datetime import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Q
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from calendars.diary.models import Diary
from calendars.schedule.models import Event, Session
from calendars.schedule.serializers import EventSerializer, SessionSerializer
from calendars.todo.models import Todo
from calendars.todo.serializers import TodoSerializer
from .enums import AuthChoices
from .models import Calendar, CalendarUser

def create_new_calendar(name="새 캘린더", user=None):
    calendar = Calendar.objects.create(name=name)
    calendar_user = CalendarUser.objects.create(
        user=user, calendar=calendar, auth=AuthChoices.OWNER, display_name=name
    )

    return calendar_user

def get_monthly_events(data, calendar, start_date, end_date):
    q = Q()
    q &= Q(schedule__calendar=calendar)
    q &= Q(start_datetime__range=[start_date, end_date])

    events = Event.objects.filter(q)

    for event in events:
        date_str = event.start_datetime.date().strftime('%Y-%m-%d')
        data[date_str].append({
            'id': f's{event.id}',
            'title': event.schedule.title,
            'color': event.schedule.color,
        })

    return data

def get_monthly_sessions(data, start_date, end_date):
    q2 = Q(start_datetime__range=[start_date, end_date])

    sessions = Session.objects.filter(q2)

    for session in sessions:
        date_str = session.start_datetime.date().strftime('%Y-%m-%d')
        data[date_str].append({
            'id': f's{session.id}',
            'title': f'{session.lesson.student.name} 레슨',
            'color': '#14863E',
        })

    return data

def get_monthly_data(month_query, calendar):
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

    data = defaultdict(list)

    data = get_monthly_events(data, calendar, start_date, end_date)
    data = get_monthly_sessions(data, start_date, end_date)

    return data

def append_events(data, calendar, date_obj):
    q_event = Q()
    q_event &= Q(schedule__calendar=calendar)
    q_event &= Q(start_datetime__date=date_obj)

    events = Event.objects.filter(q_event)

    for event in events:
        data["events"].append(EventSerializer(event).data)

    return data

def append_sessions(data, date_obj):
    q_session = Q(start_datetime__date=date_obj)

    sessions = Session.objects.filter(q_session)

    for session in sessions:
        data["events"].append(SessionSerializer(session).data)

    return data

def append_todos(data, calendar, date_obj):
    q_todo = Q()
    q_todo &= Q(calendar=calendar)
    q_todo &= Q(deadline=date_obj)

    todos = Todo.objects.filter(q_todo)

    for todo in todos:
        data["todos"].append(TodoSerializer(todo).data)

    return data

def append_diary(data, user, date_obj):
    q_diary = Q()
    q_diary &= Q(user=user)
    q_diary &= Q(date=date_obj)

    diary = Diary.objects.filter(q_diary).first()

    if diary:
        data["diary"] = diary.diary

    return data

def get_daily_data(daily_query, calendar, user):
    try:
        date_obj = datetime.fromisoformat(daily_query)
    except ValueError as e:
        raise ValidationError("올바른 형식이 아닙니다.") from e

    tz = timezone.get_current_timezone()
    date_obj = timezone.make_aware(date_obj, tz)

    data = {
        "events": [],
        "todos": [],
        "diary": "",
    }

    data = append_events(data, calendar, date_obj)
    data = append_sessions(data, date_obj)
    data = append_todos(data, calendar, date_obj)
    data = append_diary(data, user, date_obj)

    return data
