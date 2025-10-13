# specifications/models.py
from django.db import models
from products.models import Product

class Specification(models.Model):
    """
    Global reusable specification template.
    Example: ("Material composition", "Polyester")
    """
    key = models.CharField(max_length=255)
    value = models.TextField()
    is_global = models.BooleanField(default=True)

    class Meta:
        unique_together = ('key', 'value')
        ordering = ['key']

    def __str__(self):
        return f"{self.key}: {self.value}"


class ProductSpecification(models.Model):
    """
    Connects a product to a specification.
    Can either use an existing global Specification
    OR have a custom key/value for that product only.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_specifications')
    specification = models.ForeignKey(Specification, on_delete=models.SET_NULL, null=True, blank=True, related_name='product_links')

    # Optional override fields
    key = models.CharField(max_length=255, blank=True)
    value = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Product Specification'
        verbose_name_plural = 'Product Specifications'

    def __str__(self):
        if self.specification:
            return f"{self.product.name} → {self.specification.key}"
        return f"{self.product.name} → {self.key}"
