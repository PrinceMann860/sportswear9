from django.urls import path  # ✅ Missing import added
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from .admin_views import AdminOrderListView, AdminOrderDetailView

# Create DRF router and register standard API routes
router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")

# Collect router-generated URLs
urlpatterns = router.urls

# Add custom admin endpoints
urlpatterns += [
    path("admin/orders/", AdminOrderListView.as_view(), name="admin-order-list"),
    path("admin/orders/<str:order_uuid>/", AdminOrderDetailView.as_view(),)
]