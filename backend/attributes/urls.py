from django.urls import path
from . import views
from .admin_views import ProductVariantAttributeMediaViewSet

product_media = ProductVariantAttributeMediaViewSet.as_view({
    'get': 'list',
    'post': 'create',
    'delete': 'destroy'
})

single_media = ProductVariantAttributeMediaViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

urlpatterns = [
    # --- Admin APIs ---
    path("admin/attributes/", views.AttributeListCreateAdminView.as_view(), name="admin-attribute-list"),
    path("admin/attributes/<str:pk>/", views.AttributeDetailAdminView.as_view(), name="admin-attribute-detail"),
    path("admin/values/", views.AttributeValueListCreateAdminView.as_view(), name="admin-attrvalue-list"),
    path("admin/values/<str:pk>/", views.AttributeValueDetailAdminView.as_view(), name="admin-attrvalue-detail"),
    path("admin/product-attributes/", views.ProductAttributeAdminView.as_view(), name="admin-product-attributes"),
    path("admin/variants/", views.ProductVariantAdminView.as_view(), name="admin-variant-list"),

    path(
        "admin/products/<str:product_uuid>/variants/<str:variant_id>/attributes/<str:attribute_value_id>/media/",
        product_media,
        name="admin-variant-attribute-media"
    ),
    path(
        "admin/products/<str:product_uuid>/variants/<str:variant_id>/attributes/<str:attribute_value_id>/media/<str:pk>/",
        single_media,
        name="admin-variant-attribute-media-detail"
    ),
    
    # --- Public APIs ---
    path("", views.AttributeListUserView.as_view(), name="attribute-list"),
    path("<str:product_uuid>/variants/", views.ProductVariantListView.as_view(), name="product-variant-list"),
]
