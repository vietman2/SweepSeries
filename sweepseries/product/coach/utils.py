from django.core.exceptions import ObjectDoesNotExist

from .models import CoachWorkingHours, SpecialWorkingDay

def get_working_hours(coach, date):
    try:
        special_day = SpecialWorkingDay.objects.get(coach=coach, date=date)
        if special_day.is_off:
            return None
        return (special_day.start_time, special_day.end_time)
    except ObjectDoesNotExist:
        pass

    day_of_week = date.weekday()

    try:
        working_hour = CoachWorkingHours.objects.get(coach=coach, day_of_week=day_of_week)
        if working_hour.is_off:
            return None
        return (working_hour.start_time, working_hour.end_time)
    except ObjectDoesNotExist:
        return None
