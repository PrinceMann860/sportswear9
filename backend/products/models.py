from django.db import models
from shortuuid.django_fields import ShortUUIDField

from categories.models import Category
from brands.models import Brand
# from inventory.models import Inventory
# from attributes.models import ProductAttribute
# from media.models import ProductImage
# from reviews.models import Review

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
        if self.disc and self.disc > 0:
            discount_amount = (self.price * self.disc) / 100
            self.net = self.price - discount_amount
        else:
            self.net = self.price
        super().save(*args, **kwargs)
