import razorpay
import hmac
import hashlib
from django.conf import settings
from decimal import Decimal


class RazorpayService:
    """Service layer for all Razorpay operations"""
    
    @staticmethod
    def get_client():
        return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
    
    @staticmethod
    def create_order(amount, currency="INR"):
        """Create Razorpay order - amount in rupees"""
        client = RazorpayService.get_client()
        order_data = {
            "amount": int(amount * 100),  # Convert to paise
            "currency": currency,
            "payment_capture": 1,
        }
        return client.order.create(data=order_data)
    
    @staticmethod
    def verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """Verify Razorpay payment signature"""
        secret = settings.RAZORPAY_KEY_SECRET.encode()
        msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode()
        generated = hmac.new(secret, msg, hashlib.sha256).hexdigest()
        return hmac.compare_digest(generated, razorpay_signature)
    
    @staticmethod
    def refund_payment(payment_id, amount=None):
        """Initiate refund - amount in rupees"""
        client = RazorpayService.get_client()
        data = {}
        if amount:
            data["amount"] = int(amount * 100)
        return client.payment.refund(payment_id, data)
    
    @staticmethod
    def verify_webhook_signature(payload, signature):
        """Verify webhook signature"""
        expected = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
