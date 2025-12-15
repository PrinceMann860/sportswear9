from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    order_uuid = serializers.CharField(
        source="order.order_uuid",
        read_only=True
    )
    user_email = serializers.EmailField(
        source="order.user.email",
        read_only=True
    )

    class Meta:
        model = Payment
        fields = [
            "id",
            "order_uuid",
            "user_email",
            "provider",

            "razorpay_order_id",
            "razorpay_payment_id",
            "amount",
            "status",
            "method",

            "created_at",
        ]
        read_only_fields = fields

class PaymentCreateSerializer(serializers.Serializer):
    order_uuid = serializers.CharField()
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    method = serializers.CharField(required=False)


from .models import Refund


class RefundSerializer(serializers.ModelSerializer):
    order_uuid = serializers.CharField(
        source="order.order_uuid",
        read_only=True
    )
    payment_id = serializers.CharField(
        source="payment.razorpay_payment_id",
        read_only=True
    )

    class Meta:
        model = Refund
        fields = [
            "id",
            "order_uuid",
            "payment_id",
            "razorpay_refund_id",
            "amount",
            "status",
            "created_at",
        ]
class RefundCreateSerializer(serializers.Serializer):
    order_uuid = serializers.CharField()
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        required=False
    )
