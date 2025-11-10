from celery import shared_task
from django.core.cache import cache
from .models import Product
from .serializers import ProductListSerializer, ProductDetailUnifiedSerializer
from attributes.models import ProductVariant

@shared_task
def cache_product_list():
    queryset = Product.objects.filter(is_active=True).select_related("brand", "category").prefetch_related("variants__images")
    serializer = ProductListSerializer(queryset, many=True, context={"request": None})
    cache.set("cached_product_list", serializer.data, timeout=60 * 5)
    return "✅ Product list cache refreshed"

@shared_task
def cache_product_detail(product_uuid):
    from django.shortcuts import get_object_or_404
    product = get_object_or_404(Product, product_uuid=product_uuid)
    serializer = ProductDetailUnifiedSerializer(product)
    cache.set(f"product_detail_{product_uuid}", serializer.data, timeout=60 * 10)
    return f"✅ Product {product_uuid} detail cache refreshed"

@shared_task
def cache_product_variants(product_uuid):
    product = Product.objects.filter(product_uuid=product_uuid).first()
    if not product:
        return f"❌ Product {product_uuid} not found"
    variants = ProductVariant.objects.filter(product=product).prefetch_related("attributes", "images")
    # You could serialize variants here similarly to your API response
    cache.set(f"product_variants_{product_uuid}", [], timeout=60 * 10)
    return f"✅ Product {product_uuid} variants cache refreshed"
