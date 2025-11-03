# carts/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem
from attributes.serializers import ProductVariantListSerializer
from attributes.models import ProductVariant

class CartItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantListSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=ProductVariant.objects.all(),
        source="variant",
        write_only=True
    )

    class Meta:
        model = CartItem
        fields = ["id", "variant", "variant_id", "quantity", "subtotal"]
        read_only_fields = ["subtotal"]

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_items = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "user", "items", "total_items", "total_price"]
        read_only_fields = ["user"]

    def create(self, validated_data):
        user = self.context["request"].user
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart
