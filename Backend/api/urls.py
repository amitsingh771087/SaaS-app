from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView)
from .views import( ItemViewSet, UserViewSet, TenantViewSet, TenantUserViewSet, CustomerViewSet,ItemCategoryViewSet,ItemPriceViewSet,CustomerListCreateView,
    CustomerDetailView,
    CustomerTimelineView,
    CustomerImportCSVView,CustomerTimelineViewSet,  signup)


# Router for ViewSets
router = DefaultRouter()
# router.register(r'items', ItemViewSet)
router.register(r'users', UserViewSet)
router.register(r'tenants', TenantViewSet)
router.register(r'tenant-users', TenantUserViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'item-categories', ItemCategoryViewSet)
router.register(r'items', ItemViewSet)
router.register(r'item-prices', ItemPriceViewSet)
router.register(r"customer-timelines", CustomerTimelineViewSet, basename="customer-timelines")





urlpatterns = [
    
     # API Routes
    path('', include(router.urls)),
    path('signup/', signup, name='signup'),
    
    # JWT Auth Endpoints
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # customers 
    path("customers/", CustomerListCreateView.as_view(), name="customer-list-create"),
    path("customers/<str:pk>/", CustomerDetailView.as_view(), name="customer-detail"),
    path("customers/<str:pk>/timeline/", CustomerTimelineView.as_view(), name="customer-timeline"),
    path("customers/import_csv/", CustomerImportCSVView.as_view(), name="customer-import-csv"),

   
]
