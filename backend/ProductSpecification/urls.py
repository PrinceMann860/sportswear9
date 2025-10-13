# specifications/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # Global specification management
    path('admin/', views.SpecificationListCreateView.as_view(), name='spec-list'),
    path('admin/<int:pk>/', views.SpecificationDetailView.as_view(), name='spec-detail'),

    # Product-specific specs
    path('product/<str:product_uuid>/', views.ProductSpecificationListCreateView.as_view(), name='product-spec-list'),
]
