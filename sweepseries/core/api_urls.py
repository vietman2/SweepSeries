from django.urls import path
#from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter
#from rest_framework_simplejwt.views import TokenVerifyView

## Auth
from auth.agreements.views import AgreementViewSet
from auth.user.views import CheckUsernameEmailView, CheckPasswordView#, RegisterView

router = DefaultRouter()

router.register(r'agreements', AgreementViewSet, basename='agreements')

urlpatterns = [
    path('check-username-email/', CheckUsernameEmailView.as_view(), name='check_username'),
    path('check-password/', CheckPasswordView.as_view(), name='check_password'),
]

urlpatterns += router.urls
