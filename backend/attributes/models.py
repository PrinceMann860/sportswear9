from django.db import models
from shortuuid.django_fields import ShortUUIDField
from products.models import Product
from django.utils.text import slugify
import uuid


class Attribute(models.Model):
    id = ShortUUIDField(primary_key=True, length=10, unique=True, editable=False)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    id = ShortUUIDField(primary_key=True, length=12, unique=True, editable=False)
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name="values")
    value = models.CharField(max_length=255)
    meta = models.JSONField(default=dict, blank=True)  # Extra info like hex code, dimensions, etc.

    def __str__(self):
        return f"{self.attribute.name}: {self.value}"


class ProductAttribute(models.Model):
    id = ShortUUIDField(primary_key=True, length=8, unique=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="product_attributes")
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('product', 'attribute')

    def __str__(self):
        return f"{self.product.name} → {self.attribute.name}"


class ProductVariant(models.Model):
    id = ShortUUIDField(primary_key=True, length=14, unique=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=100, unique=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_default = models.BooleanField(default=False)
    attributes = models.ManyToManyField(AttributeValue, related_name="variants")

    def save(self, *args, **kwargs):
        if not self.sku:
            # Example: TSHIRT-RED-AB123
            base = slugify(self.product.name)[:10].upper().replace("-", "")
            unique_id = uuid.uuid4().hex[:5].upper()
            self.sku = f"{base}-{unique_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name} - {self.sku}"
