from django.db import models
from shortuuid.django_fields import ShortUUIDField
from products.models import Product
from decimal import Decimal
import shortuuid
from django.db.models.signals import post_save
from django.dispatch import receiver
from inventory.models import Inventory


class Attribute(models.Model):
    id = ShortUUIDField(primary_key=True, length=10, unique=True, editable=False)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class AttributeValue(models.Model):
    id = ShortUUIDField(primary_key=True, length=12, unique=True, editable=False)
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name="values")
    value = models.CharField(max_length=255)
    meta = models.JSONField(default=dict, blank=True)

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
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    net = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_default = models.BooleanField(default=False)
    attributes = models.ManyToManyField('AttributeValue', related_name="variants")

    def save(self, *args, **kwargs):
        """Auto-handle SKU, price, discount, and net price with fallback to product."""
        # Auto-generate SKU if missing
        if not self.sku:
            self.sku = f"{self.product.product_uuid}-{shortuuid.uuid()[:6].upper()}"

        # Fallback to product price if variant price is 0 or None
        if not self.price or self.price <= 0:
            self.price = getattr(self.product, "price", Decimal("0.00"))

        # Determine discount (variant > product > 0)
        discount_percent = Decimal("0.00")
        if self.discount and self.discount > 0:
            discount_percent = Decimal(self.discount)
        elif getattr(self.product, "disc", 0) and self.product.disc > 0:
            discount_percent = Decimal(str(self.product.disc))

        # Calculate net price
        price = Decimal(str(self.price))
        discount_amount = (price * discount_percent) / Decimal("100")
        self.net = price - discount_amount

        super().save(*args, **kwargs)

    # -------------------------------
    # 💰 Effective Price Utilities
    # -------------------------------
    @property
    def effective_price(self):
        """Return variant's net price, fallback to product's net if variant is 0."""
        if self.net and self.net > 0:
            return self.net
        return getattr(self.product, "net", Decimal("0.00"))

    @property
    def effective_disc(self):
        """Return the effective discount percentage."""
        if self.discount and self.discount > 0:
            return self.discount
        return getattr(self.product, "disc", Decimal("0.00"))

    @property
    def effective_net(self):
        """Alias for compatibility — same as effective_price."""
        return self.effective_price

    def __str__(self):
        return f"{self.product.name} - {self.sku}"


class ProductVariantAttributeMedia(models.Model):
    """
    Connects a ProductVariant and a specific AttributeValue,
    allowing unique images per (variant, attribute_value) pair.
    Example: Red → has red shoe photos
    """
    id = ShortUUIDField(primary_key=True, length=12, unique=True, editable=False)
    variant = models.ForeignKey("ProductVariant", on_delete=models.CASCADE, related_name="attribute_media")
    attribute_value = models.ForeignKey("AttributeValue", on_delete=models.CASCADE, related_name="variant_media")
    images = models.ManyToManyField("assets.ProductImage", related_name="attribute_value_media", blank=True)

    class Meta:
        unique_together = ("variant", "attribute_value")

    def __str__(self):
        return f"{self.variant.sku} - {self.attribute_value.value}"


@receiver(post_save, sender=ProductVariant)
def create_inventory_for_variant(sender, instance, created, **kwargs):
    if created:
        Inventory.objects.get_or_create(
            product=instance.product,
            variant=instance,
            defaults={"sku": instance.sku, "stock": 0}
        )
