# products/urls.py
from django.urls import path
from . import views, admin_views

urlpatterns = [
    # Public APIs
    path('', views.ProductListAPIView.as_view(), name='product-list'),
    path('<str:product_uuid>/', views.ProductDetailAPIView.as_view(), name='product-detail'),

    # Admin APIs
    # Product CRUD
    path('admin/create/', admin_views.ProductCreateAPIView.as_view(), name='product-create'),
    
    # Product Update
    path('admin/<str:product_uuid>/update/', admin_views.ProductUpdateAPIView.as_view(), name='product-update'),

    # Product Variants (nested under product)
    path('admin/<str:product_uuid>/variants/', admin_views.AddVariantAPIView.as_view(), name='product-add-variant'),

    # Specifications
    path('admin/<str:product_uuid>/specs/', admin_views.AddSpecificationAPIView.as_view(), name='product-add-specs'),

    # Variant Media Uploads
    path('admin/<str:product_uuid>/variant/<str:variant_id>/upload-media/', admin_views.UploadVariantMediaAPIView.as_view(), name='variant-upload-media'),

]