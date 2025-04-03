from django.contrib import admin
## Models to unregister
from django.contrib.auth.models import Group
from allauth.account.models import EmailAddress
from rest_framework.authtoken.models import TokenProxy
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken

## Models to register
from app.faq.models import FAQ
from app.inquiry.models import Inquiry
from app.notices.models import Notice

from auth.agreements.models import Agreement, AgreementVersion
from auth.person.models import Person
from auth.user.forms import UserAdmin
from auth.user.models import User, PhoneVerification
from auth.userprofile.models import UserProfile

from calendars.diary.models import Diary
from calendars.schedule.models import (
    PersonalSchedule, AcademySchedule, PersonalEvent, AcademyEvent
)
from calendars.todo.models import Todo

from community.comment.models import (
    Comment, ReComment, CommentReport, ReCommentReport, CommentLike, ReCommentLike
)
from community.post.models import Image, Post, PostReport, PostLike, PostContentView
from community.tag.models import Tag

from product.academy.models import (
    AcademyFacility, Academy, AcademyStudent, AcademyImage,
    AcademyLike, BusinessHours, SpecialDay, AcademyNotice, AcademyNoticeAttachment
)
from product.address.models import Sido, Sigungu, Address
from product.coach.models import (
    Coach, CoachProfession, CoachLike, CoachWorkingHours, SpecialWorkingDay
)
from product.contract.models import (
    Contract, LessonReviewTags, CoachReviewTags, AcademyReviewTags, ReviewImage, Review
)
from product.lesson.models import Lesson, Session, SessionRequest, ScheduleChangeRequest
from product.program.models import Target, Position, CoachTeam, Program, Curriculum

admin.site.register(FAQ)
admin.site.register(Inquiry)
admin.site.register(Notice)

admin.site.register(Agreement)
admin.site.register(AgreementVersion)
admin.site.register(Person)
admin.site.register(User, UserAdmin)
admin.site.register(PhoneVerification)
admin.site.register(UserProfile)

admin.site.register(Diary)
admin.site.register(PersonalSchedule)
admin.site.register(AcademySchedule)
admin.site.register(PersonalEvent)
admin.site.register(AcademyEvent)
admin.site.register(Todo)

admin.site.register(Comment)
admin.site.register(ReComment)
admin.site.register(CommentReport)
admin.site.register(ReCommentReport)
admin.site.register(CommentLike)
admin.site.register(ReCommentLike)
admin.site.register(Image)
admin.site.register(Post)
admin.site.register(PostReport)
admin.site.register(PostLike)
admin.site.register(PostContentView)
admin.site.register(Tag)

admin.site.register(AcademyFacility)
admin.site.register(Academy)
admin.site.register(AcademyStudent)
admin.site.register(AcademyImage)
admin.site.register(AcademyLike)
admin.site.register(BusinessHours)
admin.site.register(SpecialDay)
admin.site.register(AcademyNotice)
admin.site.register(AcademyNoticeAttachment)
admin.site.register(Sido)
admin.site.register(Sigungu)
admin.site.register(Address)
admin.site.register(Coach)
admin.site.register(CoachProfession)
admin.site.register(CoachLike)
admin.site.register(CoachWorkingHours)
admin.site.register(SpecialWorkingDay)
admin.site.register(Contract)
admin.site.register(LessonReviewTags)
admin.site.register(CoachReviewTags)
admin.site.register(AcademyReviewTags)
admin.site.register(ReviewImage)
admin.site.register(Review)
admin.site.register(Lesson)
admin.site.register(Session)
admin.site.register(SessionRequest)
admin.site.register(ScheduleChangeRequest)
admin.site.register(Target)
admin.site.register(Position)
admin.site.register(CoachTeam)
admin.site.register(Program)
admin.site.register(Curriculum)

unnecessary_models = [Group, EmailAddress, TokenProxy, OutstandingToken, BlacklistedToken]

for model in unnecessary_models:
    admin.site.unregister(model)
