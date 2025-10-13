from rest_framework import serializers
from .models import Brand


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["brand_uuid", "name","logo", "description", "is_active"]
        # read_only_fields = ['brand_uuid',]  
