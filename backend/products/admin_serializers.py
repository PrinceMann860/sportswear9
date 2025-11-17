from rest_framework import serializers
from .models import Product
from categories.models import Category
from brands.models import Brand
from attributes.models import AttributeValue
from products.utils import generate_product_variants   # <-- call your generator


class ProductCreateSerializer(serializers.ModelSerializer):
    brand = serializers.SlugRelatedField(
        slug_field='brand_uuid',
        queryset=Brand.objects.all()
    )
    category = serializers.SlugRelatedField(
        slug_field='category_uuid',
        queryset=Category.objects.all()
    )

    class Meta:
        model = Product
        fields = [
            'name', 'description', 'price', 'disc',
            'brand', 'category',
            'is_featured', 'is_active'
        ]

    def create(self, validated_data):
        # 1. Create product
        product = super().create(validated_data)

        # 2. Auto-fetch all color values
        color_values = AttributeValue.objects.filter(
            attribute__name__iexact="Color"
        )

        # 3. Auto-fetch all size values
        size_values = AttributeValue.objects.filter(
            attribute__name__iexact="Size"
        )

        # --- Safety check ---
        if not color_values.exists():
            raise serializers.ValidationError("No Color attributes exist in the system.")

        if not size_values.exists():
            raise serializers.ValidationError("No Size attributes exist in the system.")

        # 4. Generate all variants (Color × Size)
        generate_product_variants(product, color_values, size_values)

        return product
