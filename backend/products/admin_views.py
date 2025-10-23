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
from attributes.models import AttributeValue, ProductVariantAttributeMedia
from assets.serializers import ProductImageSerializer

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

    def delete(self, request, *args, **kwargs):
        product = self.get_object()
        product_name = product.name
        product.delete()
        return Response(
            {"message": f"Product '{product_name}' deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )

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


# products/admin_views.py
class UploadVariantMediaAPIView(APIView):
    """
    Upload images for a specific variant.
    """
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid, variant_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)

        images = request.FILES.getlist("images")
        alt_texts = request.data.getlist("alt_texts", [])
        is_main_flags = request.data.getlist("is_main_flags", [])

        if not images:
            return Response({"error": "No images provided"}, status=400)

        uploaded_images = []
        for i, img in enumerate(images):
            alt_text = alt_texts[i] if i < len(alt_texts) else ""
            is_main = (
                str(is_main_flags[i]).lower() in ["true", "1", "yes"]
                if i < len(is_main_flags)
                else False
            )

            image_obj = ProductImage.objects.create(
                variant=variant,
                image=img,
                alt_text=alt_text,
                is_main=is_main,
            )
            uploaded_images.append(image_obj)

        # make sure only one is marked as main
        main_images = variant.images.filter(is_main=True)
        if main_images.count() > 1:
            for extra in main_images.order_by("-created_at")[1:]:
                extra.is_main = False
                extra.save()

        serialized = ProductImageSerializer(uploaded_images, many=True, context={"request": request}).data
        return Response(
            {
                "variant_id": variant.id,
                "uploaded_count": len(uploaded_images),
                "uploaded_images": serialized,
                "message": f"{len(uploaded_images)} images uploaded successfully.",
            },
            status=201,
        )


class UploadAttributeMediaAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid, variant_id, attribute_value_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
        attr_value = get_object_or_404(AttributeValue, id=attribute_value_id)

        images = request.FILES.getlist("images")
        if not images:
            return Response({"error": "No images provided"}, status=400)

        uploaded_images = []

        for img in images:
            image_obj = ProductImage.objects.create(
                variant=variant,
                image=img,
                alt_text=request.data.get("alt_text", ""),
                is_main=request.data.get("is_main", False)
            )

            # ✅ link to attribute value
            ProductVariantAttributeMedia.objects.create(
                variant=variant,
                attribute_value=attr_value,
                image=image_obj
            )

            uploaded_images.append(image_obj)

        # ✅ Proper serialization using DRF
        serialized_images = ProductImageSerializer(uploaded_images, many=True, context={"request": request}).data

        return Response({
            "product": product.name,
            "variant_id": variant.id,
            "attribute_value": attr_value.value,
            "uploaded_count": len(uploaded_images),
            "uploaded_images": serialized_images,
            "message": f"{len(uploaded_images)} images uploaded successfully."
        }, status=201)
