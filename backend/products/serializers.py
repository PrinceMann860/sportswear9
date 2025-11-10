from rest_framework import serializers
from .models import Product, ProductCoupon
from categories.models import Category
from brands.models import Brand
from inventory.models import Inventory
from attributes.models import ProductAttribute
from assets.models import ProductImage
from reviews.models import Review
from attributes.admin_serializers import ProductVariantSerializer
from ProductSpecification.serializers import ProductSpecificationSerializer
from attributes.models import ProductVariant
from collections import defaultdict
from datetime import timedelta
from django.utils import timezone
from django.db import models
from attributes.serializers import ProductVariantListSerializer

class VariantSizeSerializer(serializers.Serializer):
    variant_id = serializers.CharField()
    size_id = serializers.CharField(allow_null=True)
    value = serializers.CharField(allow_null=True)
    stock_quantity = serializers.IntegerField()
    price = serializers.FloatField()
    is_available = serializers.BooleanField()

class VariantColorGroupSerializer(serializers.Serializer):
    color = serializers.CharField(allow_null=True)
    color_id = serializers.CharField(allow_null=True)
    color_code = serializers.CharField(allow_null=True)
    variant_ids = serializers.ListField(child=serializers.CharField())
    images = serializers.ListField()
    sizes = VariantSizeSerializer(many=True)
    is_active = serializers.BooleanField()

# ---- NESTED SERIALIZERS ----

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['brand_uuid', 'name', 'logo']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_uuid', 'name']


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['sku', 'stock', 'is_available']


class ProductAttributeSerializer(serializers.ModelSerializer):
    attribute_name = serializers.ReadOnlyField(source="attribute.name")

    class Meta:
        model = ProductAttribute
        fields = ['attribute_name', 'value']


class ProductImageNestedSerializer(serializers.ModelSerializer):
    image_uuid = serializers.ReadOnlyField()
    original_url = serializers.ReadOnlyField(source="original_url")
    thumbnail_url = serializers.ReadOnlyField(source="thumbnail_url")
    medium_url = serializers.ReadOnlyField(source="medium_url")
    large_url = serializers.ReadOnlyField(source="large_url")

    class Meta:
        model = ProductImage
        fields = [
            "id", "image_uuid", "image", "original_url",
            "thumbnail_url", "medium_url", "large_url",
            "alt_text", "is_main", "uploaded_at"
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = Review
        fields = ['id', 'user_name', 'rating', 'comment', 'created_at']




class ProductListSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source="name")
    category = serializers.CharField(source="category.name")
    gender = serializers.SerializerMethodField()  # ✅ Added
    is_new = serializers.SerializerMethodField()        # ✅ Added
    is_popular = serializers.SerializerMethodField()  
    img = serializers.SerializerMethodField()
    img2 = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    original = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    brand = BrandSerializer()
    category = CategorySerializer()
    # variants = ProductVariantListSerializer(many=True, read_only=True)
    is_in_cart = serializers.SerializerMethodField()
    # thumbnail = serializers.SerializerMethodField()
    # average_rating = serializers.SerializerMethodField()
    

    class Meta:
        model = Product
        fields = [
            "product_uuid", "title", "img", "img2", "price", "original", "discount",
            "category", "gender", "is_new", "is_popular",  # for color/size selection 
            "is_in_cart",  # ✅ New fields
            "name", "brand", "is_featured"
        ]

    def get_is_in_cart(self, obj):
        request = self.context.get("request", None)
        if request and request.user.is_authenticated:
            user = request.user
            return obj.cart_items.filter(user=user).exists()
        return False
       
    # -------------------
    #  Detect gender from category hierarchy
    # -------------------
    def get_gender(self, obj):
        category = obj.category
        while category:
            name = category.name.strip().lower()
            if name in ["men", "women", "unisex"]:
                return name.capitalize()
            category = category.parent
        return None  # or "Unisex" as a fallback

    # -------------------
    #  New Arrivals logic
    # -------------------
    def get_is_new(self, obj):
        """Mark product as new if added in the last 30 days."""
        days_threshold = 30
        return obj.created_at >= timezone.now() - timedelta(days=days_threshold)

    # -------------------
    #  Most Popular logic
    # -------------------
    def get_is_popular(self, obj):
        """Mark as popular if reviews > X or average rating > 4.5."""
        total_reviews = obj.reviews.count()
        avg_rating = obj.reviews.aggregate(models.Avg("rating")).get("rating__avg") or 0
        return total_reviews >= 5 or avg_rating >= 4.5

    # -------------------
    #  Image & pricing helpers
    # -------------------
    def get_img(self, obj):
        variant = (
            obj.variants.filter(is_default=True, images__isnull=False).first()
            or obj.variants.filter(images__isnull=False).first()
            or obj.variants.first()
        )
        if not variant:
            return None

        image = variant.images.filter(is_main=True).first() or variant.images.first()
        return image.medium_url if image else None

    def get_img2(self, obj):
        variant = (
            obj.variants.filter(is_default=True, images__isnull=False).first()
            or obj.variants.filter(images__isnull=False).first()
            or obj.variants.first()
        )
        if not variant:
            return None

        images = variant.images.all()[1:3]
        return images[0].medium_url if images else None

    def get_price(self, obj):
        return f"₹{obj.net:,.2f}"

    def get_original(self, obj):
        return f"₹{obj.price:,.2f}"

    def get_discount(self, obj):
        return f"-{int(obj.disc)}%" if obj.disc and obj.disc > 0 else None

class ProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    category = CategorySerializer()
    inventory = InventorySerializer(read_only=True)  # ✅ fixed
    variants = ProductVariantSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)  # ✅ Added here
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    default_images = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_uuid', 'name', 'description', 'price', 'disc', 'net',  'brand', 'category',
            'inventory', 'variants', 'specifications', 'reviews',
            'default_images', 'average_rating', 'created_at', 'updated_at'
        ]

    def get_average_rating(self, obj):
        ratings = obj.reviews.all().values_list('rating', flat=True)
        return round(sum(ratings) / len(ratings), 1) if ratings else None

    def get_default_images(self, obj):
        # Try default variant with images; if none, pick the first variant that has images
        variant = (
            obj.variants.filter(is_default=True, images__isnull=False).first()
            or obj.variants.filter(images__isnull=False).first()
            or obj.variants.first()
        )

        if not variant:
            return []

        imgs = variant.images.all()[:5]
        return [
            {
                "id": img.image_uuid,
                "url": img.medium_url,
                "is_main": img.is_main,
                "alt": img.alt_text,
            }
            for img in imgs
        ]


# products/serializers.py
class ProductCouponSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    cupon_uuid = serializers.ReadOnlyField()# ✅ adds "id" back as alias


    class Meta:
        model = ProductCoupon
        fields = [
            "cupon_uuid", "code", "type", "value",
            "product", "product_name",
            "start_date", "end_date",
            "usage_limit", "used_count",
            "per_user_limit",
            "active",
        ]


class SizeSerializer(serializers.ModelSerializer):
    variant_id = serializers.CharField(source='sku', read_only=True)
    size = serializers.CharField(source='size.value', read_only=True)
    available_stock = serializers.SerializerMethodField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2, source='price.final_price', read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['variant_id', 'size', 'available_stock', 'price']

    def get_available_stock(self, obj):
        try:
            inventory = Inventory.objects.get(variant=obj)
            return inventory.available_stock
        except Inventory.DoesNotExist:
            return 0


class ColorGroupSerializer(serializers.Serializer):
    color = serializers.CharField()
    images = serializers.ListField(child=serializers.URLField())
    sizes = SizeSerializer(many=True)


class ProductDetailGroupedSerializer(serializers.ModelSerializer):
    color_groups = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'color_groups']

    def get_color_groups(self, obj):
        color_groups = []
        # Group variants by color
        colors = obj.variants.values_list('color__value', flat=True).distinct()
        for color in colors:
            variants = obj.variants.filter(color__value=color)
            images = list(obj.images.filter(color__value=color).values_list('image', flat=True))
            size_data = SizeSerializer(variants, many=True).data
            color_groups.append({
                'color': color,
                'images': images,
                'sizes': size_data
            })
        return color_groups




class ProductDetailUnifiedSerializer(serializers.ModelSerializer):
    brand = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.name", read_only=True)
    variants = serializers.SerializerMethodField()
    specifications = ProductSpecificationSerializer(many=True, read_only=True)  # ✅ include specifications
    reviews = ReviewSerializer(many=True, read_only=True)

    average_rating = serializers.SerializerMethodField()  # ✅ added
    default_images = serializers.SerializerMethodField()  # ✅ added

    # class Meta:
    #     model = Product
    #     fields = [
    #         "product_uuid", "name", "description",
    #         "price", "disc", "net", "sku",
    #         "brand", "category", "variants",
    #         "created_at", "updated_at"
    #     ]

    class Meta:
        model = Product
        fields = [
            'product_uuid', 'name', 'description', 'price', 'disc', 'net',
            'brand', 'category', 'variants', 'specifications', 'reviews',
            'average_rating', 'default_images', 'created_at', 'updated_at'
        ]

    # -------------------
    #  Brand info
    # -------------------
    def get_brand(self, obj):
        if not obj.brand:
            return None
        return {
            "name": obj.brand.name,
            "logo": obj.brand.logo.url if obj.brand.logo else None
        }
    
    def get_average_rating(self, obj):
        ratings = obj.reviews.all().values_list('rating', flat=True)
        return round(sum(ratings) / len(ratings), 1) if ratings else None
    
    def get_default_images(self, obj):
        # Try default variant with images; if none, pick the first variant that has images
        variant = (
            obj.variants.filter(is_default=True, images__isnull=False).first()
            or obj.variants.filter(images__isnull=False).first()
            or obj.variants.first()
        )

        if not variant:
            return []

        imgs = variant.images.all()[:5]
        return [
            {
                "id": img.image_uuid,
                "url": img.medium_url,
                "is_main": img.is_main,
                "alt": img.alt_text,
            }
            for img in imgs
        ]
    # # -------------------
    # #  SKU (from default or first variant)
    # # -------------------
    # def get_sku(self, obj):
    #     variant = obj.variants.filter(is_default=True).first() or obj.variants.first()
    #     return variant.sku if variant else None

    # -------------------
    #  Variants grouped by color
    # -------------------
    def get_variants(self, obj):
        variants_by_color = defaultdict(lambda: {
            "color": None,
            "color_id": None,
            "color_code": None,
            "variant_ids": [],
            "images": [],
            "sizes": [],
            "is_active": False,
        })

        for variant in obj.variants.prefetch_related("attributes", "images").all():
            # Extract color & size attributes
            color_attr = next(
                (a for a in variant.attributes.all() if getattr(a.attribute, "name", "").lower() == "color"),
                None
            )
            size_attr = next(
                (a for a in variant.attributes.all() if getattr(a.attribute, "name", "").lower() == "size"),
                None
            )

            color_name = color_attr.value if color_attr else "Default"
            color_id = color_attr.id if color_attr else None
            color_code = color_attr.meta.get("hex") if color_attr and "hex" in color_attr.meta else None

            group = variants_by_color[color_name]
            group["color"] = color_name
            group["color_id"] = color_id
            group["color_code"] = color_code
            group["is_active"] = group["is_active"] or getattr(variant, "is_available", False)
            group["variant_ids"].append(variant.id)

            # ---- Add images ----
            for img in variant.images.all():
                group["images"].append({
                    "id": img.image_uuid,
                    "url": getattr(img, "medium_url", None) or getattr(img, "image", None),
                    "alt_text": getattr(img, "alt_text", ""),
                    "is_primary": getattr(img, "is_main", False),
                })

            # ---- Add size info ----
            inventory = Inventory.objects.filter(variant=variant).first()
            stock_qty = getattr(inventory, "stock", 0)
            is_available = getattr(inventory, "is_available", False)

            group["sizes"].append({
                "variant_id": variant.id,
                "size_id": size_attr.id if size_attr else None,
                "value": size_attr.value if size_attr else None,
                "stock_quantity": stock_qty,
                "price": float(variant.net),
                "is_available": is_available,
            })

        return list(variants_by_color.values())
