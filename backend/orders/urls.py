# urls.py
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet
from .admin_views import AdminOrderListView, AdminOrderDetailView

router = DefaultRouter()
router.register("orders", OrderViewSet, basename="orders")

urlpatterns = [
    *router.urls,
    path("admin/orders/", AdminOrderListView.as_view()),
    path("admin/orders/<str:order_uuid>/", AdminOrderDetailView.as_view()),
]
