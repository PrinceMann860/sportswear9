from rest_framework import serializers
from .models import Order, OrderItem
from attributes.serializers import ProductVariantListSerializer
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantListSerializer(read_only=True)
    variant_id = serializers.PrimaryKeyRelatedField(
        queryset=OrderItem._meta.get_field('variant').remote_field.model.objects.all(),
        source='variant', write_only=True
    )

    class Meta:
        model = OrderItem
        fields = ["id", "variant", "variant_id", "quantity", "price", "subtotal"]

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    class Meta:
        model = Order
        fields = [
            "order_uuid", "user", "total_amount", "status",
            "shipping_address", "items",
            "razorpay_order_id", "razorpay_payment_id", "razorpay_signature",
            "created_at"
        ]
        read_only_fields = ["user", "status", "razorpay_order_id"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        order = Order.objects.create(user=user, status="PENDING", **validated_data)

        total = Decimal("0.00")
        for item in items_data:
            variant = item["variant"]
            qty = item["quantity"]
            price = variant.net
            subtotal = price * qty
            OrderItem.objects.create(order=order, variant=variant, quantity=qty, price=price, subtotal=subtotal)
            total += subtotal

        order.total_amount = total
        order.save()
        return order
