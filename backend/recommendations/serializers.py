from rest_framework import serializers
from products.models import Product
from products.serializers import ProductListSerializer
from .models import RecentlyViewed, ProductBundle


class RecentlyViewedSerializer(serializers.ModelSerializer):
    """Serializer for recently viewed products."""
    product = ProductListSerializer(read_only=True)

    class Meta:
        model = RecentlyViewed
        fields = ["product", "viewed_at"]


class ProductBundleSerializer(serializers.ModelSerializer):
    """Serializer for product bundles (complete the look)."""
    related_products = ProductListSerializer(many=True, read_only=True)

    class Meta:
        model = ProductBundle
        fields = ["main_product", "related_products"]


class AISuggestedProductSerializer(serializers.Serializer):
    """AI-based suggested product with similarity score."""
    product = ProductListSerializer()
    score = serializers.FloatField()
