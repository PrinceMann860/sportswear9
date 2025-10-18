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


class ProductVariantAttributeUploadView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid, variant_id, attribute_value_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
        attribute_value = get_object_or_404(AttributeValue, id=attribute_value_id)

        images = request.FILES.getlist("images")
        if not images:
            return Response({"error": "No images provided"}, status=400)

        # Get or create media link
        link, _ = ProductVariantAttributeMedia.objects.get_or_create(
            variant=variant,
            attribute_value=attribute_value
        )

        uploaded_urls = []
        link.images.all().delete()  # remove old
        for img in images:
            product_image = ProductImage.objects.create(variant=variant, image=img)
            link.images.add(product_image)
            uploaded_urls.append(request.build_absolute_uri(product_image.image.url))

        return Response({
            "product": product.name,
            "variant_id": variant.id,
            "attribute_value": attribute_value.value,
            "uploaded_count": len(images),
            "uploaded_images": uploaded_urls,
            "message": f"{len(images)} images uploaded successfully."
        }, status=201)


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
        return ProductVariant.objects.filter(
            product__product_uuid=product_uuid
        ).prefetch_related("attributes")
