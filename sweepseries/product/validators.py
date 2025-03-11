import re
from urllib.parse import urlparse, urlunparse
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError

def validate_instagram_url(value):
    parsed = urlparse(value)

    if parsed.netloc not in ['www.instagram.com', 'instagram.com']:
        raise ValidationError("인스타그램 URL이 아닙니다.")

    path = parsed.path.strip('/')

    if not path or '/' in path:
        raise ValidationError("잘못된 인스타그램 URL입니다.")

    if not re.match(r'^[A-Za-z0-9._]{1,30}$', path):
        raise ValidationError("잘못된 인스타그램 URL입니다.")

    return urlunparse(parsed)

def normalize_instagram_url(value):
    parsed = urlparse(value)

    scheme = 'https'
    netloc = 'www.instagram.com'

    path = parsed.path.rstrip('/')

    normalized_url = urlunparse((scheme, netloc, path, '', '', ''))

    return normalized_url

def validate_30_minutes_interval(value):
    if value.minute % 30 != 0:
        raise DjangoValidationError("영업 시간은 30분 단위로 입력해주세요.")
