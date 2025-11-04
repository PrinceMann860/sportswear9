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


# ---- PRODUCT SERIALIZERS ----

# products/serializers.py
from rest_framework import serializers
from .models import Product
from assets.models import ProductImage


class ProductListSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField(source="pk")
    title = serializers.CharField(source="name")
    category = serializers.CharField(source="category.name")
    img = serializers.SerializerMethodField()
    img2 = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    original = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    brand = BrandSerializer()
    category = CategorySerializer()
    # thumbnail = serializers.SerializerMethodField()
    # average_rating = serializers.SerializerMethodField()
    

    class Meta:
        model = Product
        fields = [
            "id", "title", "img", "img2", "price", "original", "discount", "category",
            "product_uuid", "name", "price", "disc", "net", "brand", "category", 
              "is_featured"
        ]


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
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
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
