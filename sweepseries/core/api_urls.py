from django.urls import path
from dj_rest_auth.views import LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter

## Auth
from auth.agreements.views import AgreementViewSet
from auth.person.views import PersonViewSet
from auth.user.views import UserViewSet, UserLoginView

## Community
from community.comment.views import CommentViewSet, ReCommentViewSet
from community.post.views import PostViewSet
from community.tag.views import TagViewSet

router = DefaultRouter()

router.register(r'agreements', AgreementViewSet, basename='agreements')
router.register(r'people', PersonViewSet, basename='people')
router.register(r'users', UserViewSet, basename='users')

router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'recomments', ReCommentViewSet, basename='recomments')
router.register(r'posts', PostViewSet, basename='posts')
router.register(r'tags', TagViewSet, basename='tags')

urlpatterns = [
    path('login/', UserLoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('tokens/refresh/', get_refresh_view().as_view(), name='token_refresh'),
]

urlpatterns += router.urls
