from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .enums import ForumChoices

def get_time_since_created(created_at):     ## pylint: disable=too-many-return-statements
    now = timezone.now()
    delta = now - created_at

    if delta.days < 1:
        if delta.seconds < 60:
            return '방금 전'
        if delta.seconds < 3600:
            return f'{delta.seconds // 60}분 전'
        return f'{delta.seconds // 3600}시간 전'
    if delta.days < 7:
        return f'{delta.days}일 전'
    if delta.days < 30:
        return f'{delta.days // 7}주 전'
    if delta.days < 365:
        return f'{delta.days // 30}달 전'

    return f'{delta.days // 365}년 전'

def get_forum(text):
    if text == '덕아웃':
        return ForumChoices.DUGOUT
    if text == '드래프트':
        return ForumChoices.RECRUIT
    if text == '마켓':
        return ForumChoices.MARKET
    if text == "스틸":
        return ForumChoices.STEAL

    raise ValidationError("존재하지 않는 게시판입니다.")
