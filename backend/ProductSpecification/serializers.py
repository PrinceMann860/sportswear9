# specifications/serializers.py
from rest_framework import serializers
from .models import Specification, ProductSpecification


class SpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specification
        fields = ['id', 'key', 'value', 'is_global']


class ProductSpecificationSerializer(serializers.ModelSerializer):
    specification = SpecificationSerializer(read_only=True)
    specification_id = serializers.PrimaryKeyRelatedField(
        queryset=Specification.objects.all(),
        source='specification',
        write_only=True,
        required=False,
        allow_null=True
    )

    class Meta:
        model = ProductSpecification
        fields = ['id', 'product', 'specification', 'specification_id', 'key', 'value']
