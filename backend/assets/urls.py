from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductImageViewSet, ProductVideoViewSet

router = DefaultRouter()
router.register('images', ProductImageViewSet, basename='product-images')
router.register('videos', ProductVideoViewSet, basename='product-videos')

urlpatterns = [
    path('', include(router.urls)),
]
