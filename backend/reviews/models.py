# reviews/models.py
from django.db import models
from django.conf import settings
from products.models import Product
from django.contrib.contenttypes.fields import GenericRelation
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    
    # ✅ Make rating optional with null=True, blank=True
    rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    images = GenericRelation('assets.ProductImage', related_query_name="review")
    videos = GenericRelation('assets.ProductVideo', related_query_name="review")

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.product.name}"

    @property
    def average_rating(self):
        return self.product.reviews.aggregate(models.Avg("rating"))["rating__avg"] or 0
