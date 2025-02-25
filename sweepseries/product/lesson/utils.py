from django.db.models import Q
from django.utils import timezone

from .models import Session
from .serializers import SessionSerializer

def get_monthly_sessions(data, user, start_date, end_date, role='personal', academy=None):
    ## Base queries
    q = Q(start_datetime__range=[start_date, end_date])

    if academy:
        q &= Q(lesson__program__academy=academy)

    ## student이거나, coach중에 한명이거나 program.academy.owner이거나
    if role == 'personal':
        q &= (
            Q(lesson__student=user.person) |
            Q(coaches__person=user.person)
        )
    elif role == 'STUDENT':
        q &= Q(lesson__student=user.person)

    sessions = Session.objects.filter(q).distinct()

    for session in sessions:
        ## date must be timezone aware
        tz = timezone.get_current_timezone()
        date_str = session.start_datetime.astimezone(tz).date().strftime('%Y-%m-%d')
        data[date_str].append({
            'id': f's{session.id}',
            'title': f'{session.lesson.student.name} 레슨',
            'color': '#14863E',
        })

    return data

def get_daily_sessions(user, date, role='personal', academy=None):
    q = Q(start_datetime__date=date)

    if academy:
        q &= Q(lesson__program__academy=academy)

    if role == 'personal':
        q &= (
            Q(lesson__student=user.person) |
            Q(coaches__person=user.person)
        )
    elif role == 'STUDENT':
        q &= Q(lesson__student=user.person)

    sessions = Session.objects.filter(q).distinct()

    return SessionSerializer(sessions, many=True).data
