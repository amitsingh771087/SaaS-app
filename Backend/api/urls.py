from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ItemViewSet

# Router for ViewSets
router = DefaultRouter()
router.register(r'items', ItemViewSet)

urlpatterns = [
    # JWT Auth Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # API Routes
    path('', include(router.urls)),
]
