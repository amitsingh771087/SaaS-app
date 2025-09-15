from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import ItemViewSet, UserViewSet, TenantViewSet, TenantUserViewSet, CustomerViewSet , signup

# Router for ViewSets
router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)
router.register(r'tenants', TenantViewSet)
router.register(r'tenant-users', TenantUserViewSet)
router.register(r'customers', CustomerViewSet)



urlpatterns = [
    
     # API Routes
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    
    # JWT Auth Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

   
]
