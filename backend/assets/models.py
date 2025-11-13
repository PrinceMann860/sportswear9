from django.db import models
from shortuuid.django_fields import ShortUUIDField
from core.image_service.services import get_imgproxy_url
from core.image_service.utils import validate_image
from attributes.models import ProductVariant
from ProductSpecification.models import ProductSpecificationContent  # ✅ add this import safely (circular-safe if you use app label)


class ProductImage(models.Model):
    image_uuid = ShortUUIDField(
        length=12,
        alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        prefix='IMG-',
        unique=True,
        editable=False
    )
    variant = models.ForeignKey(
        "attributes.ProductVariant",
        on_delete=models.CASCADE,
        related_name="images",
        null=True,
        blank=True
    )
    spec_content = models.ForeignKey(
        "ProductSpecification.ProductSpecificationContent",
        on_delete=models.CASCADE,
        related_name="media",
        null=True,
        blank=True
    )
    image = models.ImageField(upload_to="uploads/products/", validators=[validate_image])
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        label = self.variant or self.specification
        return f"{label or 'Unlinked'} ({self.alt_text or 'image'})"

    @property
    def original_url(self):
        return self.image.url if self.image else ""

    def get_variant_url(self, preset="medium", fmt="webp"):
        from core.image_service.image_config import IMAGE_VARIANTS
        settings = IMAGE_VARIANTS.get(preset, {"width": 800, "quality": 80})
        return get_imgproxy_url(self.original_url, width=settings["width"], fmt=fmt, quality=settings["quality"])

    @property
    def thumbnail_url(self):
        return self.get_variant_url("thumbnail")

    @property
    def medium_url(self):
        return self.get_variant_url("medium")

    @property
    def large_url(self):
        return self.get_variant_url("large")


class ProductVideo(models.Model):
    video_uuid = ShortUUIDField(
        length=12,
        alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        prefix='VID-',
        unique=True,
        editable=False
    )
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name="videos")
    video = models.FileField(upload_to="uploads/products/videos/")
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Video for {self.variant.product.name}"
