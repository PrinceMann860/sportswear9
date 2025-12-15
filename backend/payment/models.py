from django.db import models
from django.conf import settings
from decimal import Decimal
from orders.models import Order

class Payment(models.Model):
    STATUS_CHOICES = [
        ('CREATED', 'Created'),
        ('CAPTURED', 'Captured'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    provider = models.CharField(max_length=20, default="razorpay")

    razorpay_order_id = models.CharField(max_length=255)
    razorpay_payment_id = models.CharField(max_length=255, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=255, null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES)
    method = models.CharField(max_length=50, blank=True)

    raw_response = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    
    def __str__(self):
        return f"Payment {self.razorpay_payment_id} - {self.status}"


class Refund(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="refunds")
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    razorpay_refund_id = models.CharField(max_length=255, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='PROCESSED')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Refund {self.razorpay_refund_id}"
