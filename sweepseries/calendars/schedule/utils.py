from django.utils import timezone

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

def get_duration_text(duration):
    days = duration.days
    hours, remainder = divmod(duration.seconds, 3600)
    minutes, _ = divmod(remainder, 60)

    days_text = f'{days}일' if days else ''
    hours_text = f'{hours}시간' if hours else ''
    minutes_text = f'{minutes}분' if minutes else ''

    return ' '.join([text for text in [days_text, hours_text, minutes_text] if text])
