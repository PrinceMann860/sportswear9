# inventory/serializers.py
from rest_framework import serializers
from .models import Inventory
from products.models import Product
from attributes.models import ProductVariant


class InventorySerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    variant_sku = serializers.ReadOnlyField(source="variant.sku")

    class Meta:
        model = Inventory
        fields = [
            'inventory_uuid', 'sku', 'product', 'variant',
            'product_name', 'variant_sku',
            'stock', 'reserved_stock', 'available_stock',
            'low_stock_threshold', 'is_available', 'updated_at'
        ]
        read_only_fields = ['available_stock', 'is_available', 'updated_at']
