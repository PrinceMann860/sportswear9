import razorpay
from django.conf import settings

def get_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

def create_razorpay_order(amount, currency="INR"):
    """
    amount — Decimal or float in rupees (Razorpay expects paise)
    """
    client = get_client()
    order_data = {
        "amount": int(amount * 100),  # convert ₹ to paise
        "currency": currency,
        "payment_capture": 1,
    }
    return client.order.create(data=order_data)

def verify_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
    import hmac
    import hashlib

    secret = settings.RAZORPAY_KEY_SECRET.encode()
    msg = f"{razorpay_order_id}|{razorpay_payment_id}".encode()
    generated = hmac.new(secret, msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(generated, razorpay_signature)
