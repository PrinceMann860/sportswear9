# inventory/admin_serializers.py
from rest_framework import serializers
from .models import Inventory
from products.models import Product
from attributes.models import ProductVariant

class InventoryAdminSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    variant_sku = serializers.ReadOnlyField(source='variant.sku')
    variant_attributes = serializers.SerializerMethodField()
    available_stock = serializers.SerializerMethodField()
    reserved_stock = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = [
            'inventory_uuid', 'product', 'product_name',
            'variant', 'variant_sku', 'variant_attributes',
            'sku', 'stock', 'reserved_stock', 'available_stock',
            'low_stock_threshold', 'is_available', 'updated_at'
        ]
        read_only_fields = ['available_stock', 'reserved_stock', 'updated_at']

    def get_variant_attributes(self, obj):
        """Return a list of attributes for the variant."""
        if not hasattr(obj.variant, 'attributes'):
            return []
        return [
            {"attribute": attr.attribute.name, "value": attr.value}
            for attr in obj.variant.attributes.all()
        ]

    def get_reserved_stock(self, obj):
        """
        Placeholder for reserved stock logic.
        You can later replace this with actual order reservations.
        """
        return 0  # default for now

    def get_available_stock(self, obj):
        """Compute available stock dynamically."""
        return max(obj.stock - self.get_reserved_stock(obj), 0)
