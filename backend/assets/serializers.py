from rest_framework import serializers
from .models import ProductImage, ProductVideo

class ProductImageSerializer(serializers.ModelSerializer):
    original_url = serializers.ReadOnlyField()
    thumbnail_url = serializers.ReadOnlyField()
    medium_url = serializers.ReadOnlyField()
    large_url = serializers.ReadOnlyField()

    class Meta:
        model = ProductImage
        fields = [
            'image_uuid', 'variant', 'image', 'alt_text', 'is_main',
            'original_url', 'thumbnail_url', 'medium_url', 'large_url'
        ]

class ProductVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVideo
        fields = ['video_uuid', 'variant', 'video', 'caption']
