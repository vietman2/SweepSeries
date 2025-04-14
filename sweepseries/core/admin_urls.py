from rest_framework.routers import DefaultRouter

from product.coach.views import CoachCatchBAdminView

router = DefaultRouter()

router.register(r'coaches', CoachCatchBAdminView, basename='coaches')

urlpatterns = [
    # Add other URL patterns here if needed
]

urlpatterns += router.urls
