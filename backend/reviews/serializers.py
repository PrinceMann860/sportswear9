# reviews/serializers.py
from rest_framework import serializers
from .models import Review
from products.models import Product
from assets.serializers import ReviewImageSerializer, ReviewVideoSerializer  # ✅ Use new minimal serializers
from assets.models import ProductImage, ProductVideo


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.email")
    product = serializers.SlugRelatedField(
        slug_field='product_uuid',
        queryset=Product.objects.all()
    )
    
    # ✅ Use minimal serializers
    images = ReviewImageSerializer(many=True, read_only=True)
    videos = ReviewVideoSerializer(many=True, read_only=True)
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), 
        write_only=True, 
        required=False
    )
    uploaded_videos = serializers.ListField(
        child=serializers.FileField(), 
        write_only=True, 
        required=False
    )

    class Meta:
        model = Review
        fields = [
            "review_id", "product", "user_name", "rating", "comment",
            "images", "videos", "uploaded_images", "uploaded_videos"
        ]
        read_only_fields = ["user_name", "created_at", "updated_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])
        validated_data.pop('user', None)
        
        review = Review.objects.create(user=user, **validated_data)

        for img in uploaded_images:
            ProductImage.objects.create(
                image=img,
                content_object=review
            )
        for vid in uploaded_videos:
            ProductVideo.objects.create(
                video=vid,
                content_object=review
            )

        return review

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])

        instance.rating = validated_data.get("rating", instance.rating)
        instance.comment = validated_data.get("comment", instance.comment)
        instance.save()

        for img in uploaded_images:
            ProductImage.objects.create(
                image=img,
                content_object=instance
            )
        for vid in uploaded_videos:
            ProductVideo.objects.create(
                video=vid,
                content_object=instance
            )

        return instance
