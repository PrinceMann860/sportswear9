# attributes/user_serializers.py
from rest_framework import serializers
from .models import Attribute, AttributeValue, ProductVariant
from assets.serializers import ProductImageSerializer

class AttributeValueUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ['id', 'attribute', 'value', 'meta']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Hide empty meta
        if not data.get("meta"):
            data.pop("meta", None)
        return data


class AttributeUserSerializer(serializers.ModelSerializer):
    values = AttributeValueUserSerializer(many=True, read_only=True)

    class Meta:
        model = Attribute
        fields = ['id', 'name', 'values']


class ProductVariantListSerializer(serializers.ModelSerializer):
    attributes = AttributeValueUserSerializer(many=True, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'sku', 'price', 'is_default', 'attributes', 'images']

class VariantAttributeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="attribute.name")
    value = serializers.CharField()
    meta = serializers.JSONField()
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = AttributeValue
        fields = ["id", "name", "value", "meta", "images"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Remove meta/images if empty
        if not data.get("meta"):
            data.pop("meta", None)
        if not data.get("images"):
            data.pop("images", None)
        return data
