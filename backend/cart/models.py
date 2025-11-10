from django.db import models
from django.conf import settings
from attributes.models import ProductVariant
from products.models import ProductCoupon, CouponUsage
from decimal import Decimal
import uuid

class Cart(models.Model):
    cart_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart")
    coupon = models.ForeignKey(
        ProductCoupon, on_delete=models.SET_NULL, null=True, blank=True, related_name="carts"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # -----------------------
    # Subtotal & Fees
    # -----------------------
    @property
    def subtotal(self):
        return sum(item.subtotal for item in self.items.all())

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def applied_fees(self):
        """Dynamic fee calculation (like before)."""
        from django.conf import settings
        subtotal = self.subtotal
        fees = {}
        threshold = getattr(settings, "CART_FREE_DELIVERY_THRESHOLD", None)

        if threshold and subtotal >= Decimal(threshold):
            return {"Handling Fee": 0, "Delivery Fee": 0, "Rain/Surge Fee": 0, "Other Fee": 0}

        fees["Handling Fee"] = Decimal(getattr(settings, "CART_HANDLING_FEE", 0) or 0)
        fees["Delivery Fee"] = Decimal(getattr(settings, "CART_DELIVERY_FEE", 0) or 0)
        fees["Rain/Surge Fee"] = Decimal(getattr(settings, "CART_RAIN_SURGE_FEE", 0) or 0)
        fees["Other Fee"] = Decimal(getattr(settings, "CART_OTHER_FEE", 0) or 0)
        return fees

    @property
    def total_fees(self):
        return sum(Decimal(v) for v in self.applied_fees.values())

    # -----------------------
    # Coupon / Discount Logic
    # -----------------------
    @property
    def discount_amount(self):
        """Return the discount from the applied coupon if valid."""
        if not self.coupon or not self.coupon.is_valid():
            return Decimal("0.00")

        discountable_total = self.subtotal
        discounted_price = self.coupon.apply_discount(discountable_total)
        return discountable_total - discounted_price

    @property
    def total_price(self):
        """Final payable total after discount and fees."""
        total = self.subtotal + self.total_fees - self.discount_amount
        return max(total, Decimal("0.00"))

    def clear(self):
        """Empty the cart and remove coupon."""
        self.items.all().delete()
        self.coupon = None
        self.save()

    def __str__(self):
        return f"Cart ({self.user.username})"


class CartItem(models.Model):
    cart_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'variant')

    @property
    def subtotal(self):
        """Use variant's effective price (product fallback included)."""
        return Decimal(self.variant.effective_price) * self.quantity

    def __str__(self):
        return f"{self.variant.sku} × {self.quantity}"
