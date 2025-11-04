# inventory/urls.py
from django.urls import path
from . import views, admin_views

urlpatterns = [
    # Admin APIs
    path("admin/", admin_views.InventoryListCreateAdminAPIView.as_view(), name="admin-inventory-list"),
    path("admin/<str:inventory_uuid>/", admin_views.InventoryDetailAdminAPIView.as_view(), name="admin-inventory-detail"),

    # Public
    path("<str:inventory_uuid>/", views.PublicInventoryAPIView.as_view(), name="public-inventory"),
]
