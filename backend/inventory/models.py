from django.db import models

class Inventory(models.Model):
    product = models.OneToOneField(
        'products.Product',  # 👈 use string reference instead of import
        on_delete=models.CASCADE,
        related_name="inventory"
    )
    sku = models.CharField(max_length=100, unique=True)
    stock = models.PositiveIntegerField(default=0)
    is_available = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} - {self.stock} in stock"

    def save(self, *args, **kwargs):
        # Automatically toggle availability based on stock
        self.is_available = self.stock > 0
        super().save(*args, **kwargs)

    def adjust_stock(self, quantity):
        """
        Adjust stock by quantity (positive or negative),
        ensuring stock never goes below zero.
        """
        self.stock = max(self.stock + quantity, 0)
        self.save()
