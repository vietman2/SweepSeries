from django.db.models import Q
from django.utils import timezone

from .models import PersonalEvent, AcademyEvent
from .serializers import PersonalEventSerializer, AcademyEventSerializer

def get_monthly_events(data, user, date_range, role="personal", academy=None):
    tz = timezone.get_current_timezone()
    start_date, end_date = date_range

    if academy:
        ## academy가 None이 아니면, 아카데미 일정을 가져온다
        ## 단, 수강생에게는 보여주지 않는다.
        if role == 'STUDENT':
            return data

        q = Q(start_datetime__range=[start_date, end_date], schedule__academy=academy)
        events = AcademyEvent.objects.filter(q).distinct()
        for event in events:
            ## date must be timezone aware
            date_str = event.start_datetime.astimezone(tz).date().strftime('%Y-%m-%d')
            data[date_str].append(AcademyEventSerializer(event).data)
    else:
        ## academy가 None이면, 개인 일정을 가져온다
        q = Q(start_datetime__range=[start_date, end_date], schedule__user=user)
        events = PersonalEvent.objects.filter(q).distinct()
        for event in events:
            ## date must be timezone aware
            date_str = event.start_datetime.astimezone(tz).date().strftime('%Y-%m-%d')
            data[date_str].append(PersonalEventSerializer(event).data)

    return data

def get_daily_events(user, date, role="personal", academy=None):
    if academy is None:
        q = Q(start_datetime__date=date, schedule__user=user)
        events = PersonalEvent.objects.filter(q).distinct()
        return PersonalEventSerializer(events, many=True).data

    if role == 'STUDENT':
        return []

    q = Q(start_datetime__date=date, schedule__academy=academy)
    events = AcademyEvent.objects.filter(q).distinct()
    return AcademyEventSerializer(events, many=True).data
