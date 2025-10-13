# products/admin_views.py
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Product
from attributes.models import ProductVariant
from assets.models import ProductImage
from ProductSpecification.models import ProductSpecification
from .serializers import ProductDetailSerializer
from .admin_serializers import ProductCreateSerializer
# products/admin_views.py (continue)
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
# from .serializers import ProductAdminSerializer  # ✅ use this, not ProductDetailSerializer
from attributes.admin_serializers import ProductVariantSerializer


class ProductCreateAPIView(generics.CreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsAdminUser]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ProductCreateSerializer
        return ProductDetailSerializer

    def perform_create(self, serializer):
        serializer.save()



class AddVariantAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        color_name = request.data.get("color_name")
        color_hex = request.data.get("color_hex")
        is_default = request.data.get("is_default", False)

        variant = ProductVariant.objects.create(
            product=product,
            color_name=color_name,
            color_hex=color_hex,
            is_default=is_default,
        )
        return Response({"variant_id": variant.id, "message": "Variant added"}, status=201)


class AddSpecificationAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        specs = request.data.get("specs", [])

        for spec in specs:
            ProductSpecification.objects.create(
                product=product,
                key=spec.get("key"),
                value=spec.get("value")
            )
        return Response({"message": "Specifications added"}, status=201)


class UploadVariantMediaAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, variant_id):
        variant = get_object_or_404(ProductVariant, pk=variant_id)
        images = request.FILES.getlist("images")

        for img in images:
            ProductImage.objects.create(variant=variant, image=img)

        return Response({"message": "Images uploaded successfully"}, status=201)
