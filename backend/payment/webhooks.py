from django.http import HttpResponse
import json
from decimal import Decimal

from orders.models import Order
from .models import Payment
from .services import RazorpayService
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def razorpay_webhook(request):
    """Handle Razorpay webhook events"""
    payload = request.body
    signature = request.headers.get("X-Razorpay-Signature")
    
    # Verify webhook signature
    if not RazorpayService.verify_webhook_signature(payload, signature):
        return HttpResponse(status=400)
    
    data = json.loads(payload)
    
    # Handle payment captured event
    if data.get("event") == "payment.captured":
        payment_data = data["payload"]["payment"]["entity"]
        handle_payment_captured(payment_data)
    
    return HttpResponse(status=200)


def handle_payment_captured(payment_data):
    rzp_order_id = payment_data["order_id"]
    rzp_payment_id = payment_data["id"]

    try:
        payment = Payment.objects.select_related("order").get(
            razorpay_order_id=rzp_order_id
        )

        # Idempotency
        if payment.status == "CAPTURED":
            return

        payment.razorpay_payment_id = rzp_payment_id
        payment.status = "CAPTURED"
        payment.method = payment_data.get("method")
        payment.raw_response = payment_data
        payment.save(update_fields=[
            "razorpay_payment_id",
            "status",
            "method",
            "raw_response"
        ])

        order = payment.order
        order.status = "PAID"
        order.save(update_fields=["status"])

    except Payment.DoesNotExist:
        pass  # log
