from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Prefetch

from orders.models import Order
from .models import Payment, Refund
from .services import RazorpayService
from .serializers import (
    PaymentSerializer, 
    RefundSerializer,
    PaymentCreateSerializer,
    RefundCreateSerializer
)


class PaymentViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Optimized payment queryset"""
        return Payment.objects.filter(
            order__user=self.request.user
        ).select_related(
            'order', 'order__user'
        ).only(
            'id', 'razorpay_payment_id', 'razorpay_order_id',
            'amount', 'status', 'method', 'created_at',
            'order__order_uuid', 'order__user__email'
        ).order_by('-created_at')
    
    @action(detail=False, methods=['get'], url_path='list')
    def list_payments(self, request):
        """List all payments with optimized query"""
        payments = self.get_queryset()
        serializer = PaymentSerializer(payments, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], url_path='create-razorpay-order')
    def create_razorpay_order(self, request):
        order_uuid = request.data.get('order_uuid')

        # 1️⃣ Fetch order
        order = get_object_or_404(
            Order.objects.only(
                'id', 'order_uuid', 'total_amount', 'status', 'user_id'
            ),
            order_uuid=order_uuid,
            user=request.user
        )

        if order.status != 'PENDING':
            return Response(
                {"error": "Only PENDING orders can initiate payment"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔒 2️⃣ PREVENT DUPLICATE PAYMENT ATTEMPTS (THIS IS WHERE IT GOES)
        existing = Payment.objects.filter(
            order=order,
            status="CREATED"
        ).first()

        if existing:
            # Reuse existing Razorpay order
            return Response({
                "message": "Razorpay order already exists",
                "order_uuid": str(order.order_uuid),
                "razorpay_order_id": existing.razorpay_order_id,
                "amount": int(existing.amount * 100),
                "currency": "INR",
                "key": settings.RAZORPAY_KEY_ID,
            })

        # 3️⃣ Create new Razorpay order
        rzp_order = RazorpayService.create_order(order.total_amount)

        # 4️⃣ Create Payment record
        Payment.objects.create(
            order=order,
            razorpay_order_id=rzp_order["id"],
            amount=order.total_amount,
            status="CREATED"
        )

        return Response({
            "message": "Razorpay order created",
            "order_uuid": str(order.order_uuid),
            "razorpay_order_id": rzp_order["id"],
            "amount": rzp_order["amount"],
            "currency": rzp_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
        })

    @action(detail=False, methods=['post'], url_path='verify')
    def verify_payment(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        order = get_object_or_404(
            Order,
            order_uuid=data['order_uuid'],
            user=request.user
        )

        payment = get_object_or_404(
            Payment,
            order=order,
            razorpay_order_id=data['razorpay_order_id'],
            status="CREATED"
        )

        valid = RazorpayService.verify_signature(
            data['razorpay_order_id'],
            data['razorpay_payment_id'],
            data['razorpay_signature']
        )

        if not valid:
            payment.status = "FAILED"
            payment.save(update_fields=["status"])
            order.status = "FAILED"
            order.save(update_fields=["status"])
            return Response({"error": "Invalid signature"}, status=400)

        # Success
        payment.razorpay_payment_id = data['razorpay_payment_id']
        payment.razorpay_signature = data['razorpay_signature']
        payment.method = data.get('method', 'card')
        payment.status = "CAPTURED"
        payment.save()

        order.status = "PAID"
        order.save(update_fields=["status"])

        return Response({
            "status": "paid",
            "order_uuid": str(order.order_uuid),
            "payment_id": payment.razorpay_payment_id
        })

    @action(detail=False, methods=['post'], url_path='refund', permission_classes=[permissions.IsAdminUser])
    def refund_payment(self, request):
        """Admin refund with optimized queries"""
        serializer = RefundCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Optimized order fetch with payments
        order = get_object_or_404(
            Order.objects.prefetch_related(
                Prefetch(
                    'payments',
                    queryset=Payment.objects.filter(status="CAPTURED").only(
                        'id', 'razorpay_payment_id', 'status'
                    )
                )
            ).only('order_uuid', 'status'),
            order_uuid=data['order_uuid']
        )
        
        if order.status != "PAID":
            return Response(
                {"error": "Only PAID orders can be refunded"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Access prefetched payments
        payments = list(order.payments.all())
        if not payments:
            return Response(
                {"error": "No successful payment found"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        payment = payments[0]
        amount = data.get('amount')
        rzp_refund = RazorpayService.refund_payment(
            payment.razorpay_payment_id,
            amount
        )
        
        from decimal import Decimal
        refund = Refund.objects.create(
            order=order,
            payment=payment,
            razorpay_refund_id=rzp_refund["id"],
            amount=Decimal(rzp_refund["amount"]) / 100,
            status="PROCESSED",
        )
        
        order.status = "CANCELLED"
        order.save(update_fields=["status"])
        
        payment.status = "REFUNDED"
        payment.save(update_fields=["status"])
        
        refund_serializer = RefundSerializer(refund)
        
        return Response({
            "message": "Refund initiated",
            "refund": refund_serializer.data
        })
