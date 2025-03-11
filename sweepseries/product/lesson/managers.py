from datetime import timedelta
from django.core.exceptions import ObjectDoesNotExist

from auth.person.models import Person
from product.academy.models import AcademyStudent
from product.contract.models import Contract
from .models import Lesson, Session

def get_or_create_new_student(person_id, name, phone_number):
    if person_id is not None and person_id > 0:
        return Person.objects.get(id=person_id)

    try:
        person = Person.objects.get(phone_number=phone_number)
    except ObjectDoesNotExist:
        person = Person.objects.create(name=name, phone_number=phone_number)

    return person

def add_student_to_academy(student, academy):
    ## add student to academy if not exists
    if not academy.students.filter(person__pk=student.pk).exists():
        AcademyStudent.objects.create(academy=academy, person=student)

def get_contract(student, curriculum):
    ## Case 1. 계약이 없는 경우: 새로 생성
    ##  Case 1-1. DB에 없는 Person
    ##  Case 1-2. DB에 있지만, 아카데미에 새로 등록하는 Person
    ##  Case 1-3. 아카데미에 등록되어 있지만, 해당 프로그램/커리큘럼은 처음 수강하는 경우
    ## Case 2. 계약이 만료된 경우: 새로 생성
    ## Case 3. 잔여 레슨이 있는 계약이 있는 경우: 해당 계약 반환하고, num_scheduled_lessons + 1

    contract = Contract.objects.filter(customer=student, curriculum=curriculum).first()

    if contract is None:
        ## Case 1.
        contract = Contract.objects.create(customer=student, curriculum=curriculum)

    ## 잔여 레슨이 있는지 확인
    if contract.curriculum.num_lessons > contract.scheduled_lessons:
        ## Case 3.
        contract.scheduled_lessons += 1
        contract.save()
    else:
        ## Case 2.
        contract = Contract.objects.create(
            customer=student,
            curriculum=curriculum,
            scheduled_lessons=1
        )

    return contract

def create_or_get_lesson(program, coaches, student):
    if Lesson.objects.filter(program=program, student=student).exists():
        lesson = Lesson.objects.get(program=program, student=student)
    else:
        lesson = Lesson.objects.create(program=program, student=student)

    for coach in coaches:
        lesson.coaches.add(coach)
        lesson.save()

    return lesson

def create_session(data):
    duration = data['program'].duration
    end_datetime = data['start_datetime'] + timedelta(minutes=duration)

    session = Session.objects.create(
        lesson=data['lesson'],
        start_datetime=data['start_datetime'],
        end_datetime=end_datetime,
        contract=data['contract']
    )
    session.coaches.set(data['coaches'])

    return session
