from django.urls import path
from dj_rest_auth.views import LoginView, LogoutView
from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter

## Auth
from auth.agreements.views import AgreementViewSet

router = DefaultRouter()

router.register(r'agreements', AgreementViewSet, basename='agreements')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('tokens/refresh/', get_refresh_view().as_view(), name='token_refresh'),
]

urlpatterns += router.urls
