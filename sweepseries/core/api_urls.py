from django.urls import path
from dj_rest_auth.views import LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter

## Apps
from app.faq.views import FaqViewSet
from app.inquiry.views import InquiryViewSet
from app.notices.views import NoticeViewSet

## Auth
from auth.agreements.views import AgreementViewSet
from auth.person.views import PersonViewSet, AcademyStudentViewSet
from auth.user.register_views import (
    CheckUsernameEmailView, CheckPasswordView, CreateVerificationCodeView,
    VerifyPhoneView, RegisterView
)
from auth.user.views import UserViewSet, UserLoginView, SocialLoginView
from auth.userprofile.views import UserProfileViewSet

## Calendar
from calendars.views import PersonalCalendarViewSet
from calendars.diary.views import DiaryViewSet
from calendars.schedule.views import ScheduleViewSet
from calendars.todo.views import TodoViewSet

## Community
from community.comment.views import (
    CommentViewSet, ReCommentViewSet, CommentReportViewSet, ReCommentReportViewSet
)
from community.post.views import PostViewSet, PostReportViewSet
from community.tag.views import TagViewSet

## Product
from product.academy.views import (
    AcademyViewSet, FacilityViewSet, AcademyNoticeViewSet, AcademyImageViewSet
)
from product.coach.views import CoachViewSet
from product.contract.views import ReviewViewSet
from product.lesson.views import LessonViewSet, SessionViewSet, SessionRequestViewSet
from product.program.views import ProgramViewSet, CoachTeamViewSet

router = DefaultRouter()

router.register(r'faqs', FaqViewSet, basename='faqs')
router.register(r'inquiries', InquiryViewSet, basename='inquiries')
router.register(r'notices', NoticeViewSet, basename='notices')

router.register(r'agreements', AgreementViewSet, basename='agreements')
router.register(r'people', PersonViewSet, basename='people')
router.register(r'users', UserViewSet, basename='users')
router.register(r'profiles', UserProfileViewSet, basename='user-profiles')

router.register(r'calendars', PersonalCalendarViewSet, basename='calendars')
router.register(r'diaries', DiaryViewSet, basename='diaries')
router.register(r'schedules', ScheduleViewSet, basename='schedules')
router.register(r'todos', TodoViewSet, basename='todos')

router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'recomments', ReCommentViewSet, basename='recomments')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'reports/comments', CommentReportViewSet, basename='comment-reports')
router.register(r'reports/recomments', ReCommentReportViewSet, basename='recomment-reports')
router.register(r'reports/posts', PostReportViewSet, basename='post-reports')
router.register(r'tags', TagViewSet, basename='tags')

router.register(
    r'academies/(?P<academy_id>[^/.]+)/notices', AcademyNoticeViewSet, basename='academy-notices'
)
router.register(
    r'academies/(?P<academy_id>[^/.]+)/images', AcademyImageViewSet, basename='academy-images'
)
router.register(
    r'academies/(?P<academy_id>[^/.]+)/students', AcademyStudentViewSet, basename='aca-students'
)
router.register(r'academies', AcademyViewSet, basename='academies')
router.register(r'facilities', FacilityViewSet, basename='facilities')
router.register(r'coaches', CoachViewSet, basename='coaches')
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'lessons', LessonViewSet, basename='lessons')
router.register(r'lesson_requests', SessionRequestViewSet, basename='lesson-requests')
router.register(r'programs/(?P<program_id>[^/.]+)/coaches', CoachTeamViewSet, basename='teams')
router.register(r'programs', ProgramViewSet, basename='programs')
router.register(r'sessions', SessionViewSet, basename='sessions')

urlpatterns = [
    path('login/social/', SocialLoginView.as_view(), name='kakao-login'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('register/', RegisterView.as_view(), name='register'),

    path('check-username-email/', CheckUsernameEmailView.as_view(), name='check_username'),
    path('check-password/', CheckPasswordView.as_view(), name='check_password'),
    path('verification-code/', CreateVerificationCodeView.as_view(), name='verification_code'),
    path('verify-phone/', VerifyPhoneView.as_view(), name='verify_phone'),

    path('tokens/refresh/', get_refresh_view().as_view(), name='token_refresh'),
]

urlpatterns += router.urls
