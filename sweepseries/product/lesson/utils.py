from datetime import datetime, time
from django.db.models import Q
from django.utils import timezone

from .models import Session
from .serializers import SessionSerializer

def get_simple_sessions_from_query(data, q, user, do_encoding=False):
    sessions = Session.objects.filter(q).distinct()

    for session in sessions:
        ## date must be timezone aware
        tz = timezone.get_current_timezone()
        date_str = session.start_datetime.astimezone(tz).date().strftime('%Y-%m-%d')
        if do_encoding and session.lesson.student != user.person:
            title = "*** 레슨"
            color = "#14863E80"
        else:
            title = f"{session.lesson.student.name} 레슨"
            color = "#14863E"

        data[date_str].append({
            'id': f's{session.id}',
            'title': title,
            'color': color,
        })

    return data

def get_monthly_sessions(data, user, date_range, role='personal', academy=None):
    ## Base queries
    start_date, end_date = date_range
    q = Q(start_datetime__range=[start_date, end_date])
    do_encoding = False

    if role == 'personal':
        ## 개인 캘린더 데이터 추출
        q &= (
            Q(lesson__student=user.person) |
            Q(coaches__person=user.person)
        )
        return get_simple_sessions_from_query(data, q, user)

    ## 아카데미 캘린더 데이터 추출
    q &= Q(lesson__program__academy=academy)

    if role == 'STUDENT':
        ## 접근중인 유저가 수강생이라면, 캘린더의 공개 scope를 확인하고 그에 맞게 반환한다.
        if academy.calendar_scope == 1:
            ## Scope == 1이면, 모든 세션에 대한 모든 정보를 반환한다. (쿼리에 추가할 내용이 없음)
            pass
        if academy.calendar_scope == 2:
            ## Scope == 2이면, 수강생이 참여하는 세션은 모든 정보를, 그렇지 않은 세션은 인코딩해서 반환한다.
            do_encoding = True
        if academy.calendar_scope == 3:
            ## Scope == 3이면, 수강생이 참여하는 세션만 반환한다.
            q &= Q(lesson__student=user.person)

    return get_simple_sessions_from_query(data, q, user, do_encoding)

def get_daily_sessions(user, date, role='personal', academy=None):
    q = Q(start_datetime__date=date)

    if role == 'personal':
        q &= (
            Q(lesson__student=user.person) |
            Q(coaches__person=user.person)
        )
        sessions = Session.objects.filter(q).distinct()

        return SessionSerializer(sessions, many=True).data

    do_encoding = False

    q &= Q(lesson__program__academy=academy)

    if role == 'STUDENT':
        ## monthly와 마찬가지로, 수강생이 접근을 한다면, 캘린더의 scope에 따라 반환한다.
        if academy.calendar_scope == 1:
            ## Scope == 1이면, 모든 세션에 대한 모든 정보를 반환한다. (쿼리에 추가할 내용이 없음)
            pass
        if academy.calendar_scope == 2:
            ## Scope == 2이면, 수강생이 참여하는 세션은 모든 정보를, 그렇지 않은 세션은 인코딩해서 반환한다.
            do_encoding = True
        if academy.calendar_scope == 3:
            ## Scope == 3이면, 수강생이 참여하는 세션만 반환한다.
            q &= Q(lesson__student=user.person)

    sessions = Session.objects.filter(q).distinct()
    serializer = SessionSerializer(sessions, many=True)
    serializer.context['do_encoding'] = do_encoding
    serializer.context['user'] = user

    return serializer.data

def get_unavailable_session_times(coaches, date):
    session_times = []

    tz = timezone.get_current_timezone()
    start_dt = timezone.make_aware(datetime.combine(date, time.min), tz)
    end_dt = timezone.make_aware(datetime.combine(date, time.max), tz)

    q = Q(start_datetime__range=[start_dt, end_dt])
    q &= Q(coaches__in=coaches.all())

    sessions = Session.objects.filter(q).distinct()

    for session in sessions:
        local_start = session.start_datetime.astimezone(tz)
        local_end = session.end_datetime.astimezone(tz)
        session_times.append((local_start.time(), local_end.time()))

    return session_times
