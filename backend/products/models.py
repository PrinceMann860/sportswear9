from django.db import models
from shortuuid.django_fields import ShortUUIDField

from categories.models import Category
from brands.models import Brand
# from inventory.models import Inventory
# from attributes.models import ProductAttribute
# from media.models import ProductImage
# from reviews.models import Review
import shortuuid
from decimal import Decimal


class Product(models.Model):
    product_uuid = ShortUUIDField(length=12, alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', prefix='PRD-', unique=True, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, help_text="Original price")
    disc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True, default=0.00, help_text="Discount percentage")
    net = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price after discount", editable=False)

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update variant prices when global discount changes
        for variant in self.variants.all():
            variant.save()
        # Auto-generate SKU if missing
        if not self.sku:
            self.sku = f"{self.product.product_uuid}-{shortuuid.uuid()[:6].upper()}"

        # Convert to Decimal safely
        price = Decimal(str(self.price))
        variant_disc = Decimal(str(self.discount or 0))
        product_disc = Decimal(str(getattr(self.product, "disc", 0) or 0))

        # Determine which discount to use:
        if variant_disc > 0:
            discount_percent = variant_disc
        elif product_disc > 0:
            discount_percent = product_disc
        else:
            discount_percent = Decimal("0")

        # Calculate net price
        discount_amount = (price * discount_percent) / Decimal("100")
        self.net = price - discount_amount

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.sku}"