from rest_framework import generics, viewsets, permissions, status
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant
from .admin_serializers import (
    AttributeSerializer, AttributeValueSerializer,
    ProductAttributeSerializer, ProductVariantSerializer
)
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from assets.models import ProductImage
from products.models import Product
from .models import ProductVariant, AttributeValue, ProductVariantAttributeMedia
from .admin_serializers import ProductVariantAttributeMediaUploadSerializer

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

    def get_queryset(self):
        product_uuid = self.request.query_params.get("product_uuid")
        qs = super().get_queryset()
        if product_uuid:
            qs = qs.filter(product__product_uuid=product_uuid)
        return qs



class ProductVariantAdminView(generics.ListCreateAPIView):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        product_uuid = self.request.query_params.get("product_uuid")
        qs = super().get_queryset()
        if product_uuid:
            qs = qs.filter(product__product_uuid=product_uuid)
        return qs

class ProductVariantAttributeMediaViewSet(viewsets.ModelViewSet):
    """
    Full CRUD for images attached to (variant + attribute_value)
    """
    serializer_class = ProductVariantAttributeMediaUploadSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        product_uuid = self.kwargs.get("product_uuid")
        variant_id = self.kwargs.get("variant_id")
        attribute_value_id = self.kwargs.get("attribute_value_id")

        qs = ProductVariantAttributeMedia.objects.all()
        if product_uuid:
            qs = qs.filter(variant__product__product_uuid=product_uuid)
        if variant_id:
            qs = qs.filter(variant_id=variant_id)
        if attribute_value_id:
            qs = qs.filter(attribute_value_id=attribute_value_id)
        return qs.select_related("variant", "attribute_value").prefetch_related("images")

    def create(self, request, *args, **kwargs):
        product = get_object_or_404(Product, product_uuid=self.kwargs["product_uuid"])
        variant = get_object_or_404(ProductVariant, id=self.kwargs["variant_id"], product=product)
        attribute_value = get_object_or_404(AttributeValue, id=self.kwargs["attribute_value_id"])

        images = request.FILES.getlist("images")
        if not images:
            return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)

        media_obj, _ = ProductVariantAttributeMedia.objects.get_or_create(
            variant=variant,
            attribute_value=attribute_value,
        )

        # Clear old images (if you want to replace)
        # media_obj.images.all().delete()

        uploaded = []
        for img in images:
            image = ProductImage.objects.create(variant=variant, image=img)
            media_obj.images.add(image)
            uploaded.append(request.build_absolute_uri(image.image.url))

        return Response({
            "product": product.name,
            "variant": variant.id,
            "attribute_value": attribute_value.value,
            "uploaded_count": len(uploaded),
            "uploaded_images": uploaded,
        }, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Optional: delete related ProductImage files too
        for img in instance.images.all():
            img.image.delete(save=False)
            img.delete()

        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
