from django.db import models
from django.conf import settings
from products.models import Product

class RecentlyViewed(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="recently_viewed"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "product")
        indexes = [
            models.Index(fields=["user", "-viewed_at"]),
        ]

    def __str__(self):
        return f"{self.user} viewed {self.product.name}"

class ProductBundle(models.Model):
    """Manual/computed bundle for 'complete the look'."""
    main_product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="bundle_main"
    )
    related_products = models.ManyToManyField(
        Product, related_name="bundle_related"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["main_product"], name="unique_main_product_bundle")
        ]

    def __str__(self):
        return f"Bundle for {self.main_product.name}"
