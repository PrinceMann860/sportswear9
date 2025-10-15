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

class ProductUpdateAPIView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductCreateSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'product_uuid'



class AddVariantAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        # serializer = ProductVariantSerializer(data=request.data)
        # serializer.is_valid(raise_exception=True)
        # serializer.save(product=product)
        # return Response(serializer.data, status=201)
        attributes = request.data.get("attributes", [])
        price = request.data.get("price", product.net)
        is_default = request.data.get("is_default", False)

        variant = ProductVariant.objects.create(
            product=product,
            price=price,
            is_default=is_default,
        )
        variant.attributes.set(attributes)

        return Response({
            "variant_id": variant.id,
            "sku": variant.sku,
            "message": "Variant created successfully"
        }, status=201)


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

    def post(self, request, product_uuid, variant_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
        images = request.FILES.getlist("images")

        for img in images:
            ProductImage.objects.create(variant=variant, image=img)

        return Response({
            "variant_id": variant.id,
            "message": f"{len(images)} images uploaded successfully"
        }, status=201)
