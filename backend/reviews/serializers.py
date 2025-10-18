# reviews/serializers.py
from rest_framework import serializers
from .models import Review
from assets.serializers import ProductImageSerializer, ProductVideoSerializer
from assets.models import ProductImage, ProductVideo

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.email")
    images = ProductImageSerializer(many=True, read_only=True)
    videos = ProductVideoSerializer(many=True, read_only=True)

    # For uploads via multipart
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(), write_only=True, required=False
    )

    class Meta:
        model = Review
        fields = [
            "id", "product", "user_name", "rating", "comment",
            "images", "videos", "uploaded_images", "uploaded_videos",
            "created_at", "updated_at"
        ]
        read_only_fields = ["user_name", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])

        review = Review.objects.create(user=user, **validated_data)

        # attach images/videos
        for img in uploaded_images:
            ProductImage.objects.create(image=img, variant=None, review=review)
        for vid in uploaded_videos:
            ProductVideo.objects.create(video=vid, variant=None, review=review)

        return review

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])

        instance.rating = validated_data.get("rating", instance.rating)
        instance.comment = validated_data.get("comment", instance.comment)
        instance.save()

        for img in uploaded_images:
            ProductImage.objects.create(image=img, variant=None, review=instance)
        for vid in uploaded_videos:
            ProductVideo.objects.create(video=vid, variant=None, review=instance)

        return instance
