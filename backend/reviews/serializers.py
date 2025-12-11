# reviews/serializers.py
from rest_framework import serializers
from .models import Review
from products.models import Product
from assets.serializers import ReviewImageSerializer, ReviewVideoSerializer
from assets.models import ProductImage, ProductVideo


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source="user.email")
    
    # ✅ Make product optional for updates, required for create
    product = serializers.SlugRelatedField(
        slug_field='product_uuid',
        queryset=Product.objects.all(),
        required=False  # Optional for PATCH/PUT
    )
    
    # ✅ Make rating optional
    rating = serializers.IntegerField(
        required=False,
        min_value=1,
        max_value=5,
        allow_null=True
    )
    
    # ✅ Comment already optional
    comment = serializers.CharField(required=False, allow_blank=True)
    
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

    def validate(self, attrs):
        """Ensure product is provided on create"""
        if not self.instance and 'product' not in attrs:
            raise serializers.ValidationError({
                "product": "This field is required when creating a review."
            })
        return attrs

    def create(self, validated_data):
        user = self.context["request"].user
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])
        validated_data.pop('user', None)
        
        review = Review.objects.create(user=user, **validated_data)

        for img in uploaded_images:
            ProductImage.objects.create(image=img, content_object=review)
        for vid in uploaded_videos:
            ProductVideo.objects.create(video=vid, content_object=review)

        return review

    def update(self, instance, validated_data):
        uploaded_images = validated_data.pop("uploaded_images", [])
        uploaded_videos = validated_data.pop("uploaded_videos", [])
        
        # ✅ Only update fields that are provided
        if 'rating' in validated_data:
            instance.rating = validated_data['rating']
        if 'comment' in validated_data:
            instance.comment = validated_data['comment']
        if 'product' in validated_data:
            instance.product = validated_data['product']
        
        instance.save()

        # Add new images/videos if provided
        for img in uploaded_images:
            ProductImage.objects.create(image=img, content_object=instance)
        for vid in uploaded_videos:
            ProductVideo.objects.create(video=vid, content_object=instance)

        return instance
