from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.BrandCreateAPIView.as_view(), name='admin-brand-create'),  # put this BEFORE <str:brand_uuid>/
    path('<str:brand_uuid>/admin/', views.AdminBrandDetailAPIView.as_view(), name='admin-brand-detail'),
    path('', views.BrandListAPIView.as_view(), name='brand-list'),
    path('<str:brand_uuid>/', views.BrandDetailAPIView.as_view(), name='brand-detail'),
]
