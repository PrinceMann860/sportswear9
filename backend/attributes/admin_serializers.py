from rest_framework import serializers
from .models import (
    Attribute, AttributeValue, ProductAttribute, ProductVariant, ProductVariantAttributeMedia
)
from assets.models import ProductImage
from products.models import Product

from assets.serializers import ProductImageSerializer

# ─────────────────────────────
# Attribute serializers
# ─────────────────────────────
class AttributeValueSerializer(serializers.ModelSerializer):
    attribute = serializers.PrimaryKeyRelatedField(queryset=Attribute.objects.all())

    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute', 'value', 'meta']


class AttributeSerializer(serializers.ModelSerializer):
    values = AttributeValueSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ['id', 'name', 'values']


# ─────────────────────────────
# Product Attribute
# ─────────────────────────────
class ProductAttributeSerializer(serializers.ModelSerializer):
    attribute = AttributeSerializer(read_only=True)
    attribute_id = serializers.PrimaryKeyRelatedField(
        queryset=Attribute.objects.all(), source="attribute", write_only=True
    )
    product_uuid = serializers.SlugRelatedField(
        slug_field="product_uuid",
        queryset=Product.objects.all(),
        source="product"  # maps to FK
    )
    class Meta:
        model = ProductAttribute
        fields = ['id', 'product_uuid', 'attribute', 'attribute_id']

    def get_product_uuid(self, obj):
        return obj.product.product_uuid


# ─────────────────────────────
# Nested Attribute + Variant serializers
# ─────────────────────────────
class AttributeValueNestedSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="attribute.name", read_only=True)
    images = serializers.SerializerMethodField()

    class Meta:
        model = AttributeValue
        fields = ["id", "name", "value", "meta", "images"]

    def get_images(self, obj):
        request = self.context.get("request")
        variant = self.context.get("variant") or self.parent.context.get("variant")
        if not variant:
            return []

        media = ProductVariantAttributeMedia.objects.filter(
            variant=variant, attribute_value=obj
        ).first()
        if not media:
            return []

        # ✅ Use your real ProductImageSerializer to get proper fields
        serializer = ProductImageSerializer(
            media.images.all(), many=True, context={"request": request}
        )
        return serializer.data


class ProductVariantSerializer(serializers.ModelSerializer):
    stock = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    images = ProductImageSerializer(many=True, read_only=True)  # ✅ Add this line

    product_uuid = serializers.SlugRelatedField(
        slug_field="product_uuid",
        queryset=Product.objects.all(),
        source="product"
    )
    attributes = AttributeValueNestedSerializer(many=True, read_only=True)
    attribute_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        source="attributes",
        queryset=AttributeValue.objects.all(),
        write_only=True
    )

    class Meta:
        model = ProductVariant
        fields = [
            "id", "product_uuid", "sku", "price", "net", "is_default",
            "attributes", "attribute_ids", "stock", "is_available", "images"  # ✅ added images
        ]

    def get_stock(self, obj):
        user = self.context["request"].user
        if hasattr(obj, "inventory"):
            # Show real numbers to admin only
            if user.is_staff:
                return obj.inventory.stock
        return None

    def get_is_available(self, obj):
        if hasattr(obj, "inventory"):
            return obj.inventory.is_available
        return False
    
    def get_product_uuid(self, obj):
        return obj.product.product_uuid

    def get_images(self, obj):
        request = self.context.get("request")
        if not hasattr(obj, "images"):
            return []
        return [
            request.build_absolute_uri(img.image.url)
            for img in obj.images.all() if img.image
        ]

    def to_representation(self, instance):
        context = self.context.copy()
        context["variant"] = instance
        rep = super().to_representation(instance)
        rep["attributes"] = AttributeValueNestedSerializer(
            instance.attributes.all(), many=True, context=context
        ).data
        return rep

class ProductVariantAttributeMediaUploadSerializer(serializers.ModelSerializer):
    images = serializers.ListField(child=serializers.ImageField(), write_only=True)

    class Meta:
        model = ProductVariantAttributeMedia
        fields = ["id", "variant", "attribute_value", "images"]

    def create(self, validated_data):
        images = validated_data.pop("images", [])
        instance, _ = ProductVariantAttributeMedia.objects.get_or_create(**validated_data)

        from assets.models import ProductImage
        uploaded = [ProductImage.objects.create(
            variant=instance.variant, image=img
        ) for img in images]

        instance.images.set(uploaded)
        return instance

    def to_representation(self, instance):
        request = self.context.get("request")
        serializer = ProductImageSerializer(
            instance.images.all(), many=True, context={"request": request}
        )
        return {
            "id": instance.id,
            "variant": instance.variant.id,
            "attribute_value": instance.attribute_value.value,
            "images": serializer.data,
        }
