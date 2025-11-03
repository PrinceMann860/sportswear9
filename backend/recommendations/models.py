from django.db import models
from django.conf import settings
from products.models import Product  # assume you have this

class RecentlyViewed(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True,
        related_name="recently_viewed"
    )
    session_key = models.CharField(max_length=100, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-viewed_at"]
        unique_together = ("user", "product")

    def __str__(self):
        return f"{self.user or self.session_key} viewed {self.product.name}"


class ProductBundle(models.Model):
    """Manual/computed bundle for 'complete the look'."""
    main_product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="bundle_main"
    )
    related_products = models.ManyToManyField(
        Product, related_name="bundle_related"
    )

    def __str__(self):
        return f"Bundle for {self.main_product.name}"
