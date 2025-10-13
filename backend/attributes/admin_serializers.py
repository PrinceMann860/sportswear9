# attributes/admin_serializers.py
from rest_framework import serializers
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant


class AttributeValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ['id', 'value', 'meta']


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

    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'sku', 'price', 'is_default', 'attributes']

    def create(self, validated_data):
        attributes = validated_data.pop('attributes', [])
        variant = ProductVariant.objects.create(**validated_data)
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
