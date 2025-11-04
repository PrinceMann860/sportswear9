from django.db import models
from shortuuid.django_fields import ShortUUIDField
from categories.models import Category
from brands.models import Brand
from decimal import Decimal
from django.utils import timezone
from django.contrib.auth import get_user_model

User = get_user_model()


# ============================================================
# 🛍️ PRODUCT MODEL
# ============================================================
class Product(models.Model):
    product_uuid = ShortUUIDField(
        length=12,
        alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        prefix="PRD-",
        unique=True,
        editable=False
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Original price")
    disc = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True, default=0.00,
        help_text="Discount percentage"
    )
    net = models.DecimalField(max_digits=10, decimal_places=2, editable=False, help_text="Price after discount")

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Calculate discounted net price and update variants if needed"""
        price = Decimal(str(self.price))
        discount_percent = Decimal(str(self.disc or 0))
        discount_amount = (price * discount_percent) / Decimal("100")
        self.net = price - discount_amount

        super().save(*args, **kwargs)

        # 🔁 Update all variants under this product to recalculate their prices
        for variant in self.variants.all():
            variant.save()


# ============================================================
# 🎟️ PRODUCT COUPON MODEL
# ============================================================
class ProductCoupon(models.Model):
    cupon_uuid = ShortUUIDField(
        primary_key=True,
        length=12,
        alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        prefix="CPN-",
        unique=True,
        editable=False
    )
    COUPON_TYPE_CHOICES = [
        ("percent", "Percentage"),
        ("fixed", "Fixed Amount"),
    ]

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="coupons",
        null=True,
        blank=True,  # ✅ null = global coupon
        help_text="Leave empty to make this a global coupon"
    )
    code = models.CharField(max_length=50, unique=True)
    type = models.CharField(max_length=10, choices=COUPON_TYPE_CHOICES, default="percent")
    value = models.DecimalField(max_digits=8, decimal_places=2)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=0, help_text="0 = unlimited total usage")
    used_count = models.PositiveIntegerField(default=0)
    per_user_limit = models.PositiveIntegerField(default=1, help_text="How many times one user can use this coupon")
    active = models.BooleanField(default=True)

    def __str__(self):
        scope = "GLOBAL" if not self.product else self.product.name
        return f"{self.code} ({scope})"

    def is_valid(self):
        """Check if coupon is currently valid"""
        now = timezone.now()
        if not self.active:
            return False
        if self.end_date and self.end_date < now:
            return False
        if self.usage_limit > 0 and self.used_count >= self.usage_limit:
            return False
        return True

    def apply_discount(self, price: Decimal):
        """Return discounted price given a base price"""
        if self.type == "percent":
            discount = (price * self.value) / Decimal("100")
        else:
            discount = self.value
        return max(price - discount, Decimal("0.00"))


# ============================================================
# 👤 COUPON USAGE TRACKING MODEL
# ============================================================
class CouponUsage(models.Model):
    """Tracks how many times each user used a coupon"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    coupon = models.ForeignKey(ProductCoupon, on_delete=models.CASCADE, related_name="usages")
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "coupon")

    def __str__(self):
        return f"{self.user.email} used {self.coupon.code}"
