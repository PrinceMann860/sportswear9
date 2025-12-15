from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.conf import settings
from celery.result import AsyncResult

from .models import Order
from .serializers import OrderSerializer
from .razorpay_service import create_razorpay_order, verify_signature
from .tasks import create_order_from_cart_task

from profile_app.models import Address, UserProfile


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    # 🚀 PLACE ORDER — async with Celery (RabbitMQ)
    @action(detail=False, methods=['post'])
    def place_order(self, request):
        """
        Create order from user's active cart.
        Optional: { "address_id": "uuid" }
        """
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        address_id = request.data.get("address_id")

        # ✅ 1. Fetch address
        address = None
        if address_id:
            address = Address.objects.filter(address_id=address_id, user=profile).first()
        else:
            address = Address.objects.filter(user=profile, is_default=True).first()

        if not address:
            return Response(
                {"error": "No address found. Please provide an address_id or set a default address."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # ✅ 2. Build address snapshot for order record
        shipping_address = {
            "first_name": address.first_name,
            "last_name": address.last_name,
            "mobile": address.mobile,
            "pincode": address.pincode,
            "country": address.country,
            "address_line_1": address.address_line_1,
            "locality_area_street": address.locality_area_street,
            "locality": address.locality,
            "city": address.city,
            "state": address.state,
            "landmark": address.landmark,
            "address_name": address.address_name,
        }

        # ✅ 3. Send async task to Celery
        task = create_order_from_cart_task.delay(user.id, shipping_address)

        return Response({
            "message": "Order placement started",
            "task_id": task.id
        }, status=status.HTTP_202_ACCEPTED)

    # 🚧 CHECK TASK STATUS
    @action(detail=False, methods=['get'])
    def check_task(self, request):
        task_id = request.query_params.get("task_id")
        if not task_id:
            return Response({"error": "task_id is required"}, status=400)

        result = AsyncResult(task_id)
        return Response({
            "task_id": task_id,
            "status": result.status,
            "result": result.result,
        })

    # 💳 CREATE RAZORPAY ORDER
    @action(detail=True, methods=['post'])
    def create_razorpay_order(self, request, pk=None):
        order = self.get_object()
        rzp_order = create_razorpay_order(order.total_amount)
        order.razorpay_order_id = rzp_order["id"]
        order.save()

        return Response({
            "message": "Razorpay order created",
            "order_uuid": order.order_uuid,
            "razorpay_order_id": rzp_order["id"],
            "amount": rzp_order["amount"],
            "currency": rzp_order["currency"],
            "key": settings.RAZORPAY_KEY_ID,
        })

    # 🧾 VERIFY PAYMENT
    @action(detail=True, methods=['post'])
    def verify_payment(self, request, pk=None):
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

        return Response({
            "status": "paid",
            "message": "Payment verified successfully",
            "order_uuid": order.order_uuid
        })
