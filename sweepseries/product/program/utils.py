from rest_framework import serializers

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
