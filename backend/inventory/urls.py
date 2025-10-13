# inventory/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Admin APIs
    path('admin/', views.InventoryListCreateAPIView.as_view(), name='inventory-list'),
    path('admin/<str:inventory_uuid>/', views.InventoryDetailAPIView.as_view(), name='inventory-detail'),

    # Public
    path('<str:inventory_uuid>/', views.PublicInventoryAPIView.as_view(), name='public-inventory'),
]
