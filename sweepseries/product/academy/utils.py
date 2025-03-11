from datetime import time
from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage

from .enums import DayChoices
from .models import BusinessHours, SpecialDay

def get_schedule_details(academy):
    schedules = []

    monday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.MONDAY)
    tuesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.TUESDAY)
    wednesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.WEDNESDAY)
    thursday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.THURSDAY)
    friday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.FRIDAY)
    saturday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SATURDAY)
    sunday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SUNDAY)

    schedules.append(get_daily_schedule_detail(monday))
    schedules.append(get_daily_schedule_detail(tuesday))
    schedules.append(get_daily_schedule_detail(wednesday))
    schedules.append(get_daily_schedule_detail(thursday))
    schedules.append(get_daily_schedule_detail(friday))
    schedules.append(get_daily_schedule_detail(saturday))
    schedules.append(get_daily_schedule_detail(sunday))

    return schedules

def get_weekly_schedule(academy):
    monday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.MONDAY)
    tuesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.TUESDAY)
    wednesday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.WEDNESDAY)
    thursday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.THURSDAY)
    friday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.FRIDAY)
    saturday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SATURDAY)
    sunday = BusinessHours.objects.get(academy=academy, day_of_week=DayChoices.SUNDAY)

    schedules = []

    if is_same_schedule(monday, tuesday) and is_same_schedule(tuesday, wednesday) \
    and is_same_schedule(wednesday, thursday) and is_same_schedule(thursday, friday):
        if is_same_schedule(friday, saturday) and is_same_schedule(saturday, sunday):

            return [{"day": "매일", "schedule": get_daily_schedule(monday)}]

        schedules.append({
            "day": "평일",
            "schedule": get_daily_schedule(monday)
        })
    else:
        schedules.append({
            "day": "월요일",
            "schedule": get_daily_schedule(monday)
        })
        schedules.append({
            "day": "화요일",
            "schedule": get_daily_schedule(tuesday)
        })
        schedules.append({
            "day": "수요일",
            "schedule": get_daily_schedule(wednesday)
        })
        schedules.append({
            "day": "목요일",
            "schedule": get_daily_schedule(thursday)
        })
        schedules.append({
            "day": "금요일",
            "schedule": get_daily_schedule(friday)
        })

    if is_same_schedule(saturday, sunday):
        schedules.append({
            "day": "주말",
            "schedule": get_daily_schedule(saturday)
        })
    else:
        schedules.append({
            "day": "토요일",
            "schedule": get_daily_schedule(saturday)
        })
        schedules.append({
            "day": "일요일",
            "schedule": get_daily_schedule(sunday)
        })

    return schedules

def get_daily_schedule(day):
    if day.is_closed:
        return "휴무"

    if day.is_allday:
        return "24시간 운영"

    return f"{day.open_time.strftime('%H:%M')} - {day.close_time.strftime('%H:%M')}"

def get_daily_schedule_detail(day):
    return {
        "is_closed": day.is_closed,
        "is_allday": day.is_allday,
        "open_time": day.open_time.strftime('%H:%M'),
        "close_time": day.close_time.strftime('%H:%M')
    }

def is_same_schedule(day1, day2):
    if day1.is_closed and day2.is_closed:
        return True

    if day1.is_allday and day2.is_allday:
        return True

    if day1.open_time == day2.open_time and day1.close_time == day2.close_time:
        if not day1.is_allday and not day2.is_allday and not day1.is_closed and not day2.is_closed:
            return True

    return False

def update_daily_schedule(day, new_schedule):
    day.is_closed = new_schedule["is_closed"]
    day.is_allday = new_schedule["is_allday"]
    day.open_time = new_schedule["open_time"]
    day.close_time = new_schedule["close_time"]
    day.save()

    return day

def upload_logo(uuid, file):
    filename = file.name.split("/")[-1]
    path = f"products/academies/{uuid}/main_logo/{filename}"
    default_storage.save(path, file)

    return path

def get_operating_hours(academy, date):
    try:
        special_day = SpecialDay.objects.get(date=date)
        if special_day.is_closed:
            return None
        return (special_day.start_time, special_day.end_time)
    except ObjectDoesNotExist:
        pass

    day_of_week = date.weekday()

    try:
        business_hours = academy.business_hours.get(day_of_week=day_of_week)
        if business_hours.is_closed:
            return None
        if business_hours.is_allday:
            return (time(0, 0), time(23, 59))
        return (business_hours.open_time, business_hours.close_time)
    except ObjectDoesNotExist:
        return None
