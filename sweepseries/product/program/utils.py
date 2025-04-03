from datetime import datetime, timedelta
from rest_framework import serializers

from product.academy.utils import get_operating_hours
from product.coach.utils import get_working_hours
from product.lesson.utils import get_unavailable_session_times
from .models import Curriculum

def update_curriculums(program, curriculums):
    ## num_lessons는 유일하기 때문에, 이미 존재하는 num_lessons인 경우 update, 아닌 경우 create
    ## 이미 존재하는 num_lessons 중, curriculums에 없는 num_lessons는 delete
    existing_curriculums = program.curriculums.all()
    existing_num_lessons = [curriculum.num_lessons for curriculum in existing_curriculums]

    for curriculum in curriculums:
        num_lessons = curriculum.get("num_lessons")
        price = curriculum.get("price")

        if num_lessons < 1:
            raise serializers.ValidationError("수업 횟수는 1 이상이어야 합니다.")

        if price < 0:
            raise serializers.ValidationError("가격은 0 이상이어야 합니다.")

        if num_lessons in existing_num_lessons:
            existing_curriculum = existing_curriculums.get(num_lessons=num_lessons)
            existing_curriculum.price = price
            existing_curriculum.is_deleted = False
            existing_curriculum.save()

            existing_num_lessons.remove(num_lessons)
        else:
            Curriculum.objects.create(program=program, num_lessons=num_lessons, price=price)

    for num_lessons in existing_num_lessons:
        existing_curriculum = existing_curriculums.get(num_lessons=num_lessons)
        existing_curriculum.is_deleted = True
        existing_curriculum.save()

    return program

def create_curriculum(program, num_lessons, price):
    if num_lessons < 1:
        raise serializers.ValidationError("수업 횟수는 1 이상이어야 합니다.")

    if price < 0:
        raise serializers.ValidationError("가격은 0 이상이어야 합니다.")

    Curriculum.objects.create(program=program, num_lessons=num_lessons, price=price)

    return program

def generate_time_slots_from_academy(program, date):
    academy_hours = get_operating_hours(program.academy, date)

    if academy_hours is None:
        ## 아카데미 휴무일이기 때문에, 빈 리스트 반환
        return None

    academy_open_time, academy_close_time = academy_hours

    slots = []
    current = datetime.combine(datetime.today(), academy_open_time)
    end = datetime.combine(datetime.today(), academy_close_time)

    while current < end:
        ## append times in "HH:MM" format
        slots.append(current.time().strftime("%H:%M"))
        current += timedelta(minutes=30)

    return (slots, academy_open_time, academy_close_time)

def filter_coaches_working_hours(coaches, date, open_time, close_time):
    aggregated_start = open_time
    aggregated_end = close_time

    for coach in coaches:
        coach_work_hours = get_working_hours(coach, date)

        if coach_work_hours is None:
            ## 한명의 코치라도 불가능하다면, 모든 슬롯이 불가능
            return None

        coach_open_time, coach_close_time = coach_work_hours

        aggregated_start = max(aggregated_start, coach_open_time)
        aggregated_end = min(aggregated_end, coach_close_time)

    return (aggregated_start, aggregated_end)

def get_time_slots(date, slots, aggregated_start, aggregated_end):
    available_times = []

    for slot in slots:
        slot_start = datetime.strptime(slot, "%H:%M").time()
        slot_start_dt = datetime.combine(date, slot_start)
        slot_end_dt = slot_start_dt + timedelta(minutes=30)

        # Check if within working hours and has no conflicts
        available = aggregated_start <= slot_start <= aggregated_end

        available_times.append({"time": slot, "is_available": available})

    return available_times

def is_time_conflicting(slot_start_dt, slot_end_dt, session_times, date):
    for res_start, res_end in session_times:
        res_start_dt = datetime.combine(date, res_start)
        res_end_dt = datetime.combine(date, res_end)
        if slot_start_dt < res_end_dt and slot_end_dt > res_start_dt:
            return True
    return False

def filter_session_times(coaches, date, slots, aggregated_start, aggregated_end):
    session_times = get_unavailable_session_times(coaches, date)

    available_times = []

    for slot in slots:
        slot_start = datetime.strptime(slot, "%H:%M").time()
        slot_start_dt = datetime.combine(date, slot_start)
        slot_end_dt = slot_start_dt + timedelta(minutes=30)

        # Check if within working hours and has no conflicts
        available = aggregated_start <= slot_start <= aggregated_end and not is_time_conflicting(
            slot_start_dt, slot_end_dt, session_times, date
        )

        available_times.append({"time": slot, "is_available": available})

    return available_times

def get_available_times(program, team, date):
    # 주어진 날에 대하여
    # 무조건 30분 단위
    ## 1. 아카데미 영업 시간 중에
    ## 2. 코치들의 근무 시간
    ## 3. 코치들의 예약된 시간
    # 를 확인하여 가능한 시간을 반환

    # 1. 아카데미 영업 시간으로부터 30분 간격의 슬롯 생성
    result = generate_time_slots_from_academy(program, date)

    # 1-1. 슬롯이 없다면, 아카데미 휴무일이거나, 영업 시간이 없는 경우
    if result is None:
        return None

    slots = result[0]
    academy_open_time = result[1]
    academy_close_time = result[2]

    # 2. 프로그램이 코치팀 임의 선택인 경우, 모든 슬롯이 가능한 것으로 간주
    if program.select_disabled:
        return [{"time": slot, "is_available": True} for slot in slots]

    # 3. 코치팀을 유저가 선택해야 하는데, DB에 팀이 없는 경우, 오류 반환
    if team is None:
        raise serializers.ValidationError("팀을 선택해야 합니다.")

    # 4. 코치들의 근무 시간을 필터. 유저가 선택한 코치 중, 한명이라도 불가능한 시간대는, 불가능하다.
    result = filter_coaches_working_hours(team.coaches.all(), date, academy_open_time, academy_close_time)

    if result is None:
        return [{"time": slot, "is_available": False} for slot in slots]

    aggregated_start = result[0]
    aggregated_end = result[1]

    # 5. 코치들의 예약된 시간 필터
    return filter_session_times(team.coaches, date, slots, aggregated_start, aggregated_end)

def get_available_times_from_session(session, date):
    # 1. 아카데미 영업 시간으로부터 30분 간격의 슬롯 생성
    program = session.lesson.program
    result = generate_time_slots_from_academy(program, date)

    # 1-1. 슬롯이 없다면, 아카데미 휴무일이거나, 영업 시간이 없는 경우
    if result is None:
        return None

    slots = result[0]
    academy_open_time = result[1]
    academy_close_time = result[2]

    # 2. 프로그램이 코치팀 임의 선택인 경우, 모든 슬롯이 가능한 것으로 간주
    if program.select_disabled:
        return [{"time": slot, "is_available": True} for slot in slots]

    # 4. 코치들의 근무 시간을 필터. 유저가 선택한 코치 중, 한명이라도 불가능한 시간대는, 불가능하다.
    result = filter_coaches_working_hours(
        session.coaches.all(),
        date,
        academy_open_time,
        academy_close_time
    )

    if result is None:
        return [{"time": slot, "is_available": False} for slot in slots]

    return get_time_slots(date, slots, result[0], result[1])
