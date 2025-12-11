# assets/serializers.py
from rest_framework import serializers
from .models import ProductImage, ProductVideo


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = [
            "image_uuid",
            "image_url",
            "alt_text",
            "is_main",
            "uploaded_at",
            "variant",
            "spec_content",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


# ✅ New minimal serializer for reviews
class ReviewImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["image_uuid", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url


class ProductVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVideo
        fields = ['video_uuid', 'variant', 'video', 'video_url', 'caption', 'uploaded_at']
    
    def get_video_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.video.url)
        return obj.video.url


# ✅ New minimal serializer for reviews
class ReviewVideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductVideo
        fields = ['video_uuid', 'video_url']
    
    def get_video_url(self, obj):
        request = self.context.get("request")
        if request:
            return request.build_absolute_uri(obj.video.url)
        return obj.video.url
