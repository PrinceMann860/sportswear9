from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductSpecificationContentViewSet

# Create a DRF router instance
router = DefaultRouter()
router.register(
    r"specs",  # Base URL path
    ProductSpecificationContentViewSet,
    basename="product-spec-content"
)

urlpatterns = [
    # Automatically adds:
    # GET     /specs/           → list
    # POST    /specs/           → create
    # GET     /specs/{uuid}/    → retrieve
    # PUT     /specs/{uuid}/    → update
    # PATCH   /specs/{uuid}/    → partial update
    # DELETE  /specs/{uuid}/    → delete
    path("", include(router.urls)),
]
