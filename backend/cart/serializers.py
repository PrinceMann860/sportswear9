# carts/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from attributes.serializers import ProductVariantListSerializer
from attributes.models import ProductVariant
from inventory.models import Inventory
from assets.serializers import ProductImageSerializer

class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantListSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source="variant",
        write_only=True
    )
    quantity = serializers.IntegerField(min_value=1)

    class Meta:
        model = CartItem
        fields = ["cart_item_id", "variant", "variant_id", "quantity", "subtotal"]
        read_only_fields = ["subtotal"]

    def validate(self, data):
        # ensure inventory exists and enough stock
        variant = data.get("variant") or self.instance.variant if self.instance else None
        quantity = data.get("quantity", getattr(self.instance, "quantity", 1))

        if not variant:
            # if creating, variant will be in validated_data under "variant" key
            variant = data["variant"]

        try:
            inventory = Inventory.objects.get(variant=variant)
        except Inventory.DoesNotExist:
            raise serializers.ValidationError("No inventory record for this variant.")

        if quantity > inventory.available_stock:
            raise serializers.ValidationError(
                f"Requested quantity ({quantity}) exceeds available stock ({inventory.available_stock})."
            )

        return data

    def create(self, validated_data):
        # attach cart in view's perform_create
        return super().create(validated_data)

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get("quantity", instance.quantity)
        instance.save()
        return instance


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_fees = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    applied_fees = serializers.SerializerMethodField()
    discount_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True, default=0)

    class Meta:
        model = Cart
        fields = [
            "cart_id",  "items", "subtotal",
            "applied_fees", "total_fees", "total_items",
            "discount_amount", "total_price"
        ]
        read_only_fields = ["subtotal", "applied_fees", "total_fees", "total_price"]

    def get_applied_fees(self, obj):
        """Return fees in a readable structure."""
        return obj.applied_fees
