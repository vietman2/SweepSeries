from django.urls import path
from dj_rest_auth.views import LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter

## Apps
from app.faq.views import FaqViewSet
from app.notices.views import NoticeViewSet

## Auth
from auth.agreements.views import AgreementViewSet
from auth.person.views import PersonViewSet
from auth.user.views import UserViewSet, UserLoginView, KakaoLoginView, NaverLoginView

## Calendar
from calendars.calendarapp.views import CalendarViewSet

## Community
from community.comment.views import (
    CommentViewSet, ReCommentViewSet, CommentReportViewSet, ReCommentReportViewSet
)
from community.post.views import PostViewSet, PostReportViewSet
from community.tag.views import TagViewSet

## Product
from product.academy.views import AcademyViewSet, FacilityViewSet, AcademyNoticeViewSet
from product.coach.views import CoachViewSet
from product.program.views import ProgramViewSet

router = DefaultRouter()

router.register(r'faqs', FaqViewSet, basename='faqs')
router.register(r'notices', NoticeViewSet, basename='notices')

router.register(r'agreements', AgreementViewSet, basename='agreements')
router.register(r'people', PersonViewSet, basename='people')
router.register(r'users', UserViewSet, basename='users')

router.register(r'calendars', CalendarViewSet, basename='calendars')

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
router.register(r'academies', AcademyViewSet, basename='academies')
router.register(r'facilities', FacilityViewSet, basename='facilities')
router.register(r'coaches', CoachViewSet, basename='coaches')
router.register(r'programs', ProgramViewSet, basename='programs')

urlpatterns = [
    path('login/kakao/', KakaoLoginView.as_view(), name='kakao-login'),
    path('login/naver/', NaverLoginView.as_view(), name='naver-login'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('tokens/refresh/', get_refresh_view().as_view(), name='token_refresh'),
]

urlpatterns += router.urls
