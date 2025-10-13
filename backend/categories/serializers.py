# categories/serializers.py
from rest_framework import serializers
from .models import Category

class RecursiveCategorySerializer(serializers.Serializer):
    def to_representation(self, value):
        serializer = CategorySerializer(value, context=self.context)
        return serializer.data


class CategorySerializer(serializers.ModelSerializer):
    children = RecursiveCategorySerializer(many=True, read_only=True)
    parent = serializers.SlugRelatedField(slug_field="category_uuid", queryset=Category.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Category
        fields = [
            "category_uuid",
            "name",
            "slug",
            "parent",
            "is_active",
            "children",  # 👈 include children for nesting
        ]
