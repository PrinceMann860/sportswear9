from django.urls import path
from . import views, admin_views

urlpatterns = [
    # ===========================
    # 🌐 Public APIs
    # ===========================
    path('', views.ProductListAPIView.as_view(), name='product-list'),
    path('<str:product_uuid>/', views.ProductDetailAPIView.as_view(), name='product-detail'),

    # ✅ Coupon Validation for checkout
    path('coupons/validate/', admin_views.ValidateCouponAPIView.as_view(), name='validate-coupon'),

   # ===========================
    # 🛠️ Admin APIs
    # ===========================
    path('admin/create/', admin_views.ProductCreateAPIView.as_view(), name='product-create'),

    # ✅ Global Coupons FIRST (to avoid conflict)
    path("admin/coupons/", admin_views.GlobalCouponListCreateAPIView.as_view(), name="global-coupon-list-create"),
    path("admin/coupons/<int:pk>/", admin_views.GlobalCouponDetailAPIView.as_view(), name="global-coupon-detail"),

    # Product-specific
    path('admin/<str:product_uuid>/', admin_views.ProductUpdateAPIView.as_view(), name='product-update'),
    path('admin/<str:product_uuid>/variants/', admin_views.AddVariantAPIView.as_view(), name='product-add-variant'),
    path('admin/<str:product_uuid>/specs/', admin_views.AddSpecificationAPIView.as_view(), name='product-add-specs'),
    path('admin/<str:product_uuid>/variant/<str:variant_id>/upload-media/', admin_views.UploadVariantMediaAPIView.as_view(), name='variant-upload-media'),
    path('admin/<str:product_uuid>/variant/<str:variant_id>/attribute/<int:attribute_value_id>/upload-media/', admin_views.UploadAttributeMediaAPIView.as_view(), name='variant-attribute-upload-media'),

    # Product Coupons
    path("admin/<str:product_uuid>/coupons/", admin_views.ProductCouponListCreateAPIView.as_view(), name="product-coupon-list-create"),
    path("admin/<str:product_uuid>/coupons/<int:pk>/", admin_views.ProductCouponDetailAPIView.as_view(), name="product-coupon-detail"),
]
