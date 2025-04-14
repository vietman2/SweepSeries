from django.core.exceptions import ObjectDoesNotExist
from django.core.files.storage import default_storage

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

def upload_profile_image(uuid, file):
    filename = file.name.split("/")[-1]
    path = f"products/coaches/{uuid}/{filename}"

    s3_client = default_storage.connection.meta.client
    bucket_name = default_storage.bucket.name

    s3_client.upload_fileobj(
        file,
        bucket_name,
        path,
        ExtraArgs={'ACL': 'public-read'}
    )

    return path
