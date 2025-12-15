from rest_framework import serializers
from .models import Order, OrderItem
from attributes.serializers import ProductVariantListSerializer
from decimal import Decimal
from django.db.models import Prefetch


class OrderItemSerializer(serializers.ModelSerializer):
    variant = ProductVariantListSerializer(read_only=True)
    product_name = serializers.CharField(source='variant.product.name', read_only=True)
    brand_name = serializers.CharField(source='variant.product.brand.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = [
            "id", "variant", "product_name", "brand_name",
            "quantity", "price", "subtotal"
        ]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    latest_payment = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Order
        fields = [
            "order_uuid", "user", "user_email", "total_amount", "status",
            "subtotal", "total_items", "handling_fee", "delivery_fee",
            "rain_surge_fee", "other_fee", "discount_amount",
            "shipping_address", "items", "latest_payment",
            "created_at"
        ]
        read_only_fields = [
            "user", "status", "razorpay_order_id", "created_at"
        ]
    
    def get_latest_payment(self, obj):
        """Get the most recent payment - already prefetched"""
        # Access prefetched data without additional query
        payments = obj.payments.all()
        if payments:
            payment = payments[0]  # Already ordered by -created_at in prefetch
            return {
                'payment_id': payment.razorpay_payment_id,
                'amount': payment.amount,
                'status': payment.status,
                'method': payment.method,
                'created_at': payment.created_at,
            }
        return None
    
    @staticmethod
    def setup_eager_loading(queryset):
        """
        Perform necessary eager loading of data.
        Call this method in ViewSet's get_queryset()
        """
        from payment.models import Payment
        
        queryset = queryset.select_related('user')
        queryset = queryset.prefetch_related(
            Prefetch(
                'items',
                queryset=OrderItem.objects.select_related(
                    'variant__product__brand'
                )
            ),
            Prefetch(
                'payments',
                queryset=Payment.objects.order_by('-created_at')
            )
        )
        return queryset
