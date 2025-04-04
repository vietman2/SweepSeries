from io import BytesIO
from PIL import Image
from django.conf import settings
from django.utils import timezone
import boto3

s3 = boto3.client(
    's3',
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    endpoint_url=settings.AWS_S3_ENDPOINT_URL,
    region_name='kr-standard',
    config=boto3.session.Config(signature_version='s3v4'),
)

def get_presigned_url(filename: str) -> str:
    return s3.generate_presigned_url(
        ClientMethod='get_object',
        Params={
            'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
            'Key': f'{filename}',
        },
        ExpiresIn=300,
    )

def is_admin_page(request: object) -> bool:
    admin_page_url = settings.ADMIN_PAGE_URL
    return request.META.get('HTTP_ORIGIN') == admin_page_url

def get_time_text(time):
    ampm = '오전'
    local_time = timezone.localtime(time)
    ## return in correct timezones
    hour = local_time.strftime('%H')
    minute = local_time.strftime('%M')

    if hour > '12':
        ampm = '오후'
        hour = int(hour) - 12

    if minute == '00':
        return f'{ampm} {hour}시'

    return f'{ampm} {hour}시 {minute}분'

def get_duration_text(duration) -> str:
    days = duration.days
    hours, remainder = divmod(duration.seconds, 3600)
    minutes, _ = divmod(remainder, 60)

    days_text = f'{days}일' if days else ''
    hours_text = f'{hours}시간' if hours else ''
    minutes_text = f'{minutes}분' if minutes else ''

    return ' '.join([text for text in [days_text, hours_text, minutes_text] if text])

def generate_photo_file() -> BytesIO:
    file = BytesIO()
    image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
    image.save(file, "png")
    file.name = "test.png"
    file.seek(0)
    return file
