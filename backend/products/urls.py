# products/urls.py
from django.urls import path
from . import views, admin_views

urlpatterns = [
    # Public APIs
    path('', views.ProductListAPIView.as_view(), name='product-list'),
    path('<str:product_uuid>/', views.ProductDetailAPIView.as_view(), name='product-detail'),

    # Admin APIs
    path('admin/create/', admin_views.ProductCreateAPIView.as_view(), name='product-create'),
    path('admin/<int:pk>/add-variant/', admin_views.AddVariantAPIView.as_view(), name='add-variant'),
    path('admin/<int:pk>/add-specs/', admin_views.AddSpecificationAPIView.as_view(), name='add-specs'),
    path('admin/variant/<int:variant_id>/upload-media/', admin_views.UploadVariantMediaAPIView.as_view(), name='upload-media'),
]