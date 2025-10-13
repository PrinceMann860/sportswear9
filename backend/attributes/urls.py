# attributes/urls.py
from django.urls import path
from . import views

urlpatterns = [
    # --- Admin APIs ---
    path("admin/attributes/", views.AttributeListCreateAdminView.as_view(), name="admin-attribute-list"),
    path("admin/attributes/<int:pk>/", views.AttributeDetailAdminView.as_view(), name="admin-attribute-detail"),
    path("admin/values/", views.AttributeValueListCreateAdminView.as_view(), name="admin-attrvalue-list"),
    path("admin/values/<int:pk>/", views.AttributeValueDetailAdminView.as_view(), name="admin-attrvalue-detail"),
    path("admin/product-attributes/", views.ProductAttributeAdminView.as_view(), name="admin-product-attributes"),
    path("admin/variants/", views.ProductVariantAdminView.as_view(), name="admin-variant-list"),

    # --- Public APIs ---
    path("", views.AttributeListUserView.as_view(), name="attribute-list"),
    path("<str:product_uuid>/variants/", views.ProductVariantListView.as_view(), name="product-variant-list"),
]
