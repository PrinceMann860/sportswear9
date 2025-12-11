# assets/models.py
from django.db import models
from shortuuid.django_fields import ShortUUIDField
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from core.image_service.services import get_imgproxy_url
from core.image_service.utils import validate_image
from attributes.models import ProductVariant
from ProductSpecification.models import ProductSpecificationContent
from backend.storage_backends import MediaStorage


# ✅ Custom upload path for review images
def review_image_upload_path(instance, filename):
    """Generate upload path: products/{product_uuid}/reviews/{filename}"""
    if instance.content_type and instance.content_type.model == 'review':
        # Get the review object
        from reviews.models import Review
        review = Review.objects.get(pk=instance.object_id)
        return f"products/{review.product.product_uuid}/reviews/{filename}"
    
    # Default path for variant/spec images
    return f"products/{filename}"


# ✅ Custom upload path for review videos
def review_video_upload_path(instance, filename):
    """Generate upload path: products/{product_uuid}/reviews/{filename}"""
    if instance.content_type and instance.content_type.model == 'review':
        from reviews.models import Review
        review = Review.objects.get(pk=instance.object_id)
        return f"products/{review.product.product_uuid}/reviews/{filename}"
    
    # Default path for variant videos
    return f"uploads/products/videos/{filename}"


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
    
    # GenericForeignKey for reviews
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # ✅ Use custom upload path function
    image = models.ImageField(
        upload_to=review_image_upload_path,  # Changed from "products/"
        storage=MediaStorage(), 
        validators=[validate_image]
    )
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        label = self.variant or self.spec_content or self.content_object
        return f"{label or 'Unlinked'} ({self.alt_text or 'image'})"

    @property
    def original_url(self):
        return self.image.url if self.image else ""

    def get_variant_url(self, preset="medium", fmt="webp"):
        from core.image_service.image_config import IMAGE_VARIANTS
        settings = IMAGE_VARIANTS.get(preset, {"width": 800, "quality": 80})
        return get_imgproxy_url(
            self.original_url, 
            width=settings["width"], 
            fmt=fmt, 
            quality=settings["quality"]
        )

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
    variant = models.ForeignKey(
        ProductVariant, 
        on_delete=models.CASCADE, 
        related_name="videos",
        null=True,
        blank=True
    )
    
    # GenericForeignKey for reviews
    content_type = models.ForeignKey(
        ContentType, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True
    )
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    # ✅ Use custom upload path function
    video = models.FileField(
        upload_to=review_video_upload_path,  # Changed from static path
        storage=MediaStorage()
    )
    caption = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.variant:
            return f"Video for {self.variant.product.name}"
        elif self.content_object:
            return f"Video for {self.content_object}"
        return f"Video {self.video_uuid}"
