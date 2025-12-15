# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from celery.result import AsyncResult

from .models import Order
from .serializers import OrderSerializer
from .tasks import create_order_from_cart_task
from profile_app.models import Address, UserProfile


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post"]

    def get_queryset(self):
        qs = Order.objects.filter(user=self.request.user).order_by("-created_at")
        return OrderSerializer.setup_eager_loading(qs)

    # POST /orders/place_order/
    @action(detail=False, methods=["post"])
    def place_order(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        address_id = request.data.get("address_id")
        if address_id:
            address = Address.objects.filter(
                address_id=address_id, user=profile
            ).first()
        else:
            address = Address.objects.filter(
                user=profile, is_default=True
            ).first()

        if not address:
            return Response(
                {"error": "No address found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

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

        task = create_order_from_cart_task.delay(user.id, shipping_address)

        return Response(
            {"task_id": task.id},
            status=status.HTTP_202_ACCEPTED,
        )

    # GET /orders/check_task/?task_id=
    @action(detail=False, methods=["get"])
    def check_task(self, request):
        task_id = request.query_params.get("task_id")
        if not task_id:
            return Response({"error": "task_id required"}, status=400)

        result = AsyncResult(task_id)
        return Response(
            {
                "task_id": task_id,
                "status": result.status,
                "result": result.result,
            }
        )
