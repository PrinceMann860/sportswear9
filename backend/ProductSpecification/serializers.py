# specifications/serializers.py
from rest_framework import serializers
from .models import ProductSpecificationContent
from assets.serializers import ProductImageSerializer



class ProductSpecificationContentSerializer(serializers.ModelSerializer):
    media = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = ProductSpecificationContent
        fields = ["content_uuid", "data", "media"]


