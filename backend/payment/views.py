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
        """Create Razorpay order"""
        order_uuid = request.data.get('order_uuid')
        
        # Optimized order fetch
        order = get_object_or_404(
            Order.objects.only(
                'order_uuid', 'total_amount', 'status', 'user_id', 'razorpay_order_id'
            ),
            order_uuid=order_uuid,
            user=request.user
        )
        
        if order.status != 'PENDING':
            return Response(
                {"error": "Only PENDING orders can initiate payment"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rzp_order = RazorpayService.create_order(order.total_amount)
        
        order.razorpay_order_id = rzp_order["id"]
        order.save(update_fields=['razorpay_order_id'])
        
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
        """Verify payment with optimized queries"""
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Optimized order fetch
        order = get_object_or_404(
            Order.objects.only(
                'order_uuid', 'razorpay_order_id', 'status',
                'total_amount', 'user_id'
            ),
            order_uuid=data['order_uuid'],
            user=request.user
        )
        
        if order.razorpay_order_id != data['razorpay_order_id']:
            return Response({"error": "Order mismatch"}, status=400)
        
        valid = RazorpayService.verify_signature(
            data['razorpay_order_id'],
            data['razorpay_payment_id'],
            data['razorpay_signature']
        )
        
        if not valid:
            order.status = "FAILED"
            order.save(update_fields=["status"])
            return Response(
                {"status": "failed", "error": "Invalid signature"},
                status=400
            )
        
        order.status = "PAID"
        order.razorpay_payment_id = data['razorpay_payment_id']
        order.razorpay_signature = data['razorpay_signature']
        order.save(update_fields=["status", "razorpay_payment_id", "razorpay_signature"])
        
        payment = Payment.objects.create(
            order=order,
            razorpay_payment_id=data['razorpay_payment_id'],
            razorpay_order_id=data['razorpay_order_id'],
            amount=order.total_amount,
            status="CAPTURED",
            method=data.get('method', 'card')
        )
        
        payment_serializer = PaymentSerializer(payment)
        
        return Response({
            "status": "paid",
            "message": "Payment verified successfully",
            "order_uuid": str(order.order_uuid),
            "payment": payment_serializer.data
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
