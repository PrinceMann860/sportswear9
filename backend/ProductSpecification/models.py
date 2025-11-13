from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.contrib.postgres.fields import JSONField  # ✅ if using PostgreSQL


class ProductSpecificationContent(models.Model):
    """
    Dynamic key-value specs (like Amazon-style 'About this item', 'Product details', etc.)
    Supports arbitrary structured data via JSON.
    """
    content_uuid = ShortUUIDField(
        length=12,
        alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        prefix='CNT-',
        unique=True,
        editable=False,
    )
    product = models.OneToOneField(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="spec_content"
    )

    # ✅ Flexible JSON for any custom fields (title-value or grouped sections)
    data = models.JSONField(default=dict)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Specs for {self.product.name}"
