#from dj_rest_auth.jwt_auth import get_refresh_view
from rest_framework.routers import DefaultRouter
#from rest_framework_simplejwt.views import TokenVerifyView

## Auth
from auth.agreements.views import AgreementViewSet

router = DefaultRouter()

router.register(r'agreements', AgreementViewSet, basename='agreements')

urlpatterns = router.urls
