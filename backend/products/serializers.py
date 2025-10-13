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

class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    category = CategorySerializer()
    thumbnail = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'product_uuid', 'name', 'price', 'disc', 'net', 'brand', 'category', 
            'thumbnail', 'average_rating', 'is_featured'
        ]

    def get_thumbnail(self, obj):
        # get default variant or first variant
        default_variant = obj.variants.filter(is_default=True).first() or obj.variants.first()
        if not default_variant:
            return None
        img = default_variant.images.filter(is_main=True).first()
        return img.image.url if img else None


    def get_average_rating(self, obj):
        ratings = obj.reviews.all().values_list('rating', flat=True)
        return round(sum(ratings) / len(ratings), 1) if ratings else None


class ProductDetailSerializer(serializers.ModelSerializer):
    brand = BrandSerializer()
    category = CategorySerializer()
    inventory = InventorySerializer(read_only=True)  # ✅ fixed
    variants = ProductVariantSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    default_images = serializers.SerializerMethodField()

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
        default_variant = obj.variants.filter(is_default=True).first()
        if not default_variant:
            default_variant = obj.variants.first()
        if not default_variant:
            return []
        return ProductImageSerializer(default_variant.images.all(), many=True).data
