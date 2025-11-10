# inventory/models.py
from django.db import models
import uuid

class Inventory(models.Model):
    inventory_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='inventories'
    )
    variant = models.OneToOneField(
        'attributes.ProductVariant',
        on_delete=models.CASCADE,
        related_name='inventory'
    )
    
    sku = models.CharField(max_length=100, unique=True)
    stock = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5)
    is_available = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.variant.sku} | {self.stock} in stock"

    def save(self, *args, **kwargs):
        self.is_available = self.stock > 0
        super().save(*args, **kwargs)

    @property
    def available_stock(self):
        # if you later add reservations, subtract them here.
        return self.stock

    def reduce_stock(self, qty):
        """Reduce stock by qty and update availability. Raises ValueError if insufficient."""
        if qty > self.stock:
            raise ValueError(f"Insufficient stock for {self.variant.sku}")
        self.available_stock -= qty
        self.is_available = self.stock > 0
        self.save(update_fields=["available_stock"])
