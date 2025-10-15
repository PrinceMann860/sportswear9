# attributes/user_serializers.py
from rest_framework import serializers
from .models import Attribute, AttributeValue, ProductVariant


class AttributeValueUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = ['id', 'value', 'meta']


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
