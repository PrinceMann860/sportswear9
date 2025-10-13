from rest_framework import viewsets, permissions
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant
from .admin_serializers import (
    AttributeSerializer, AttributeValueSerializer, ProductAttributeSerializer, ProductVariantSerializer,
)

# Admin Views: Full access
class AttributeViewSet(viewsets.ModelViewSet):
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [permissions.IsAdminUser]

class AttributeValueViewSet(viewsets.ModelViewSet):
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer
    permission_classes = [permissions.IsAdminUser]

class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAdminUser]

