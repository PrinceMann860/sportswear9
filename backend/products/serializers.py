from rest_framework import serializers
from .models import Product
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


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_main', 'alt_text']


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

    class Meta:
        model = Product
        fields = [
            "id", "title", "img", "img2", "price", "original", "discount", "category"
        ]

    def get_img(self, obj):
        variant = obj.variants.filter(is_default=True).first() or obj.variants.first()
        if not variant:
            return None
        img = variant.images.filter(is_main=True).first() or variant.images.first()
        return img.medium_url if img else None

    def get_img2(self, obj):
        variant = obj.variants.filter(is_default=True).first() or obj.variants.first()
        if not variant:
            return None
        imgs = variant.images.all()[:2]
        return imgs[1].medium_url if len(imgs) > 1 else None

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
        variant = obj.variants.filter(is_default=True).first() or obj.variants.first()
        if not variant:
            return []
        imgs = variant.images.all()[:5]
        return [
            {
                "id": img.image_uuid,
                "url": img.medium_url,
                "is_main": img.is_main,
                "alt": img.alt_text
            } for img in imgs
        ]

