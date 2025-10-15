# attributes/admin_serializers.py
from rest_framework import serializers
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant
import requests

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


class ProductAttributeSerializer(serializers.ModelSerializer):
    attribute = AttributeSerializer(read_only=True)
    attribute_id = serializers.PrimaryKeyRelatedField(
        queryset=Attribute.objects.all(), source="attribute", write_only=True
    )

    class Meta:
        model = ProductAttribute
        fields = ['id', 'product', 'attribute', 'attribute_id']


class ProductVariantSerializer(serializers.ModelSerializer):
    attributes = serializers.PrimaryKeyRelatedField(
        many=True, queryset=AttributeValue.objects.all()
    )
    images = serializers.PrimaryKeyRelatedField(many=True, read_only=True)


    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'sku', 'price', 'is_default', 'attributes', 'images']


    def create(self, validated_data):
        attributes = validated_data.pop("attributes", [])
        product = validated_data.get("product")
        price = validated_data.get("price", getattr(product, "net", None))
        is_default = validated_data.get("is_default", False)
        variant = ProductVariant.objects.create(
            product=product,
            price=price,
            is_default=is_default
        )
        variant.attributes.set(attributes)

        return variant

    def update(self, instance, validated_data):
        attributes = validated_data.pop('attributes', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if attributes is not None:
            instance.attributes.set(attributes)
        return instance


