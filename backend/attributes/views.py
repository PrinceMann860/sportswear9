# attributes/views.py
from rest_framework import generics, permissions
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant
from .admin_serializers import (
    AttributeSerializer, AttributeValueSerializer,
    ProductAttributeSerializer, ProductVariantSerializer
)
from attributes.admin_serializers import ProductVariantSerializer
from .serializers import AttributeUserSerializer, ProductVariantListSerializer
# ---------------------- Admin Views ----------------------

class AttributeListCreateAdminView(generics.ListCreateAPIView):
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [permissions.IsAdminUser]


class AttributeDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Attribute.objects.all()
    serializer_class = AttributeSerializer
    permission_classes = [permissions.IsAdminUser]


class AttributeValueListCreateAdminView(generics.ListCreateAPIView):
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer
    permission_classes = [permissions.IsAdminUser]


class AttributeValueDetailAdminView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AttributeValue.objects.all()
    serializer_class = AttributeValueSerializer
    permission_classes = [permissions.IsAdminUser]


class ProductAttributeAdminView(generics.ListCreateAPIView):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer
    permission_classes = [permissions.IsAdminUser]


class ProductVariantAdminView(generics.ListCreateAPIView):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAdminUser]


# ---------------------- Public (User) Views ----------------------

class AttributeListUserView(generics.ListAPIView):
    """User filter view — lists all attributes & values for filters"""
    queryset = Attribute.objects.prefetch_related("values").all()
    serializer_class = AttributeUserSerializer
    permission_classes = [permissions.AllowAny]


class ProductVariantListView(generics.ListAPIView):
    """User endpoint to list all variants for a given product"""
    serializer_class = ProductVariantListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_uuid = self.kwargs.get("product_uuid")
        return ProductVariant.objects.filter(product__product_uuid=product_uuid).prefetch_related("attributes")
