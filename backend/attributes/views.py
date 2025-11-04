from rest_framework import generics, permissions
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant
from .admin_serializers import (
    AttributeSerializer, AttributeValueSerializer,
    ProductAttributeSerializer, ProductVariantSerializer
)
from .serializers import AttributeUserSerializer, ProductVariantListSerializer
# attributes/admin_views.py (or views.py)
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.response import Response
from .models import ProductVariant, AttributeValue
from .admin_serializers import ProductVariantAttributeMediaUploadSerializer
from rest_framework.permissions import IsAdminUser

from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from assets.models import ProductImage
from .models import ProductVariant, AttributeValue, ProductVariantAttributeMedia
from products.models import Product

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

# attributes/views.py
class AttributeListUserView(generics.ListAPIView):
    queryset = Attribute.objects.prefetch_related("values__variant_media__images")
    serializer_class = AttributeUserSerializer
    permission_classes = [permissions.AllowAny]



class ProductVariantListView(generics.ListAPIView):
    serializer_class = ProductVariantListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_uuid = self.kwargs.get("product_uuid")
        return ProductVariant.objects.filter(
            product__product_uuid=product_uuid
        ).prefetch_related("attributes", "images", "attribute_media__images")

