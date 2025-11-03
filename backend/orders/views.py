from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from .razorpay_service import create_razorpay_order, verify_signature

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def create_razorpay_order(self, request, pk=None):
        """Create Razorpay order for this Order"""
        order = self.get_object()
        rzp_order = create_razorpay_order(order.total_amount)
        order.razorpay_order_id = rzp_order["id"]
        order.save()
        return Response({
            "razorpay_order_id": rzp_order["id"],
            "amount": rzp_order["amount"],
            "currency": rzp_order["currency"],
            "key": request.settings.RAZORPAY_KEY_ID,  # frontend uses this
        })

    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
        """Verify Razorpay signature after payment"""
        order = self.get_object()
        data = request.data
        valid = verify_signature(
            data.get("razorpay_order_id"),
            data.get("razorpay_payment_id"),
            data.get("razorpay_signature")
        )
        if not valid:
            order.status = "FAILED"
            order.save()
            return Response({"status": "failed", "error": "Invalid signature"}, status=400)

        order.status = "PAID"
        order.razorpay_payment_id = data.get("razorpay_payment_id")
        order.razorpay_signature = data.get("razorpay_signature")
        order.save()
        return Response({"status": "paid", "message": "Payment verified successfully"})
