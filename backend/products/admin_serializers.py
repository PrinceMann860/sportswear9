from rest_framework import serializers
from .models import Product
from categories.models import Category
from brands.models import Brand

class ProductCreateSerializer(serializers.ModelSerializer):
    brand = serializers.SlugRelatedField(slug_field='brand_uuid', queryset=Brand.objects.all())
    category = serializers.SlugRelatedField(slug_field='category_uuid', queryset=Category.objects.all())

    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'brand', 'category', 'is_featured', 'is_active']
