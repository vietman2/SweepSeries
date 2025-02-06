from .enums import AuthChoices
from .models import Calendar, CalendarUser

def create_new_calendar(name="새 캘린더", user=None):
    calendar = Calendar.objects.create(name=name)
    calendar_user = CalendarUser.objects.create(
        user=user, calendar=calendar, auth=AuthChoices.OWNER, display_name=name
    )

    return calendar_user
