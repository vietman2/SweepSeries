import re
from urllib.parse import urlparse, urlunparse
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError

def get_instagram_url(input_url: str) -> str:
    input_url = input_url.strip()

    # Ensure URL has a scheme for proper parsing
    if not input_url.startswith(('http://', 'https://')):
        input_url = 'https://' + input_url

    parsed = urlparse(input_url)

    # Validate Instagram domain
    if parsed.netloc.lower() not in ('instagram.com', 'www.instagram.com'):
        raise ValidationError("인스타그램 URL이 아닙니다.")

    # Extract the username from path
    path_segments = [segment for segment in parsed.path.split('/') if segment]

    if not path_segments:
        raise ValidationError("인스타그램 사용자 이름을 확인할 수 없습니다.")

    username = path_segments[0]

    # Validate username format (Instagram standards)
    if not re.fullmatch(r'[A-Za-z0-9._]{1,30}', username):
        raise ValidationError(
            "잘못된 인스타그램 사용자 이름입니다. "
            "사용자 이름은 최대 30자의 영문, 숫자, 밑줄(_), 점(.)만 허용됩니다."
        )

    return username

def validate_30_minutes_interval(value):
    if value.minute % 30 != 0:
        raise DjangoValidationError("영업 시간은 30분 단위로 입력해주세요.")
