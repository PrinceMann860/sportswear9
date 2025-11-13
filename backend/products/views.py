from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, NumberFilter, BooleanFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from .models import Product
from attributes.models import ProductVariant, AttributeValue
from assets.models import ProductImage
from inventory.models import Inventory
from .serializers import ProductListSerializer, ProductDetailUnifiedSerializer
from .pagination import ProductCursorPagination
from .tasks import cache_product_list, cache_product_detail, cache_product_variants


# -----------------------
# FILTER LOGIC
# -----------------------
class ProductFilter(FilterSet):
    category = CharFilter(field_name="category__slug", lookup_expr="iexact")
    brand = CharFilter(field_name="brand__name", lookup_expr="icontains")
    gender = CharFilter(field_name="gender", lookup_expr="iexact")
    is_featured = BooleanFilter(field_name="is_featured")
    is_new = BooleanFilter(field_name="is_new")
    is_popular = BooleanFilter(field_name="is_popular")
    discount_min = NumberFilter(field_name="disc", lookup_expr="gte")
    discount_max = NumberFilter(field_name="disc", lookup_expr="lte")
    price_min = NumberFilter(field_name="net", lookup_expr="gte")
    price_max = NumberFilter(field_name="net", lookup_expr="lte")

    class Meta:
        model = Product
        fields = [
            "category", "brand", "gender",
            "is_featured", "is_new", "is_popular",
            "discount_min", "discount_max",
            "price_min", "price_max"
        ]


# -----------------------
# PRODUCT LIST VIEW
# -----------------------
class ProductListAPIView(generics.ListAPIView):
    """
    🔹 Public paginated product list
    🔹 Supports search, filtering, sorting, and hybrid caching
    """
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("brand", "category")
        .prefetch_related("variants__images", "category")
    )

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    filterset_class = ProductFilter
    search_fields = ["name", "description", "brand__name", "category__name"]
    ordering_fields = ["price", "net", "disc", "created_at"]
    ordering = ["-created_at"]
    pagination_class = ProductCursorPagination

    def list(self, request, *args, **kwargs):
        """
        Hybrid cached + async updated product list
        """
        cache_key = "cached_product_list"
        data = cache.get(cache_key)
        if data:
            return Response(data)

        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page, many=True)
        data = serializer.data

        cache.set(cache_key, data, timeout=60 * 5)
        cache_product_list.delay()  # refresh async
        return self.get_paginated_response(data)


# -----------------------
# PRODUCT DETAIL VIEW
# -----------------------
class ProductDetailAPIView(generics.RetrieveAPIView):
    """
    Returns unified product detail view with variants, specifications, and reviews
    """
    serializer_class = ProductDetailUnifiedSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    lookup_field = "product_uuid"

    queryset = (
        Product.objects.filter(is_active=True)
        .select_related("brand", "category", "spec_content")
        .prefetch_related(
            "variants__images",   # ✅ nested relation
            "inventories",
            "reviews",
            "variants"
        )
    )


    def retrieve(self, request, *args, **kwargs):
        product_uuid = kwargs.get("product_uuid")
        cache_key = f"product_detail_{product_uuid}"

        data = cache.get(cache_key)
        if data:
            return Response(data)

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = serializer.data
        cache.set(cache_key, data, timeout=60 * 10)
        cache_product_detail.delay(product_uuid)
        return Response(data)

    def get_object(self):
        obj = super().get_object()
        color = self.request.query_params.get("color")
        if color:
            variant = obj.variants.filter(attributes__value__iexact=color).first()
            if variant:
                self.variant = variant
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["variant"] = getattr(self, "variant", None)
        return context


# -----------------------
# PRODUCT VARIANTS MATRIX VIEW
# -----------------------
class ProductVariantMatrixAPIView(APIView):
    """
    Returns structured variant info grouped by color → sizes, stock, images.
    Cached + async refreshed using Celery (RabbitMQ broker)
    """
    permission_classes = [AllowAny]

    def get(self, request, product_uuid):
        cache_key = f"product_variants_{product_uuid}"
        data = cache.get(cache_key)
        if data:
            return Response(data)

        product = get_object_or_404(Product, product_uuid=product_uuid)
        variants = ProductVariant.objects.filter(product=product).prefetch_related(
            "attributes",
            "images",
        )

        # Group by color
        color_groups = []
        colors_seen = {}

        for variant in variants:
            attr_values = {v.attribute.name.lower(): v for v in variant.attributes.all()}
            color_val = attr_values.get("color")
            size_val = attr_values.get("size")

            color_name = color_val.value if color_val else "Default"
            color_id = color_val.id if color_val else None
            color_code = color_val.meta.get("code") if color_val and isinstance(color_val.meta, dict) else None

            # Get inventory
            inv = Inventory.objects.filter(variant=variant).first()
            stock_qty = inv.available_stock if inv else 0
            is_available = stock_qty > 0

            # Prepare size entry
            size_entry = {
                "variant_id": variant.id,
                "size_id": size_val.id if size_val else None,
                "value": size_val.value if size_val else None,
                "stock_quantity": stock_qty,
                "price": float(variant.net),
                "is_available": is_available,
            }

            # Prepare images
            images = [
                {
                    "id": img.image_uuid,
                    "url": img.image.url,
                    "alt_text": img.alt_text,
                    "is_primary": img.is_main,
                }
                for img in variant.images.all()
            ]

            # Add or merge into color group
            if color_name not in colors_seen:
                colors_seen[color_name] = {
                    "color": color_name,
                    "color_id": color_id,
                    "color_code": color_code,
                    "variant_ids": [variant.id],
                    "images": images,
                    "sizes": [size_entry],
                    "is_active": False,
                }
            else:
                colors_seen[color_name]["variant_ids"].append(variant.id)
                colors_seen[color_name]["sizes"].append(size_entry)
                # Merge images if not already present
                existing_urls = {i["url"] for i in colors_seen[color_name]["images"]}
                for img in images:
                    if img["url"] not in existing_urls:
                        colors_seen[color_name]["images"].append(img)

        color_groups = list(colors_seen.values())

        # Default images (first variant or main)
        default_variant = variants.first()
        default_images = [
            {
                "id": img.image_uuid,
                "url": img.image.url,
                "is_main": img.is_main,
                "alt": img.alt_text,
            }
            for img in getattr(default_variant, "images", []).all()
        ] if default_variant else []

        data = {
            "variants": color_groups,
            "specifications": [],
            "reviews": [],
            "average_rating": None,
            "default_images": default_images,
        }

        cache.set(cache_key, data, timeout=60 * 10)
        cache_product_variants.delay(product_uuid)
        return Response(data)
