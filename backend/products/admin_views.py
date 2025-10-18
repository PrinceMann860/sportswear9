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


# products/admin_views.py
class UploadVariantMediaAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid, variant_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)

        images = request.FILES.getlist("images")
        alt_texts = request.data.getlist("alt_texts", [])
        is_main_flags = request.data.getlist("is_main_flags", [])

        uploaded = []
        for i, img in enumerate(images):
            alt_text = alt_texts[i] if i < len(alt_texts) else ""
            is_main = False
            if i < len(is_main_flags):
                flag = str(is_main_flags[i]).lower()
                is_main = flag in ["true", "1", "yes"]

            # create the ProductImage
            image_obj = ProductImage.objects.create(
                variant=variant,
                image=img,
                alt_text=alt_text,
                is_main=is_main
            )
            uploaded.append({
                "uuid": image_obj.image_uuid,
                "alt_text": image_obj.alt_text,
                "is_main": image_obj.is_main,
                "image_url": image_obj.medium_url
            })

        # ✅ ensure only one default image per variant
        main_images = [img for img in variant.images.all() if img.is_main]
        if len(main_images) > 1:
            # keep the latest as main, others set to false
            for extra in main_images[:-1]:
                extra.is_main = False
                extra.save()

        return Response({
            "variant_id": variant.id,
            "uploaded": uploaded,
            "message": f"{len(uploaded)} images uploaded successfully"
        }, status=201)



class UploadAttributeMediaAPIView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, product_uuid, variant_id, attribute_value_id):
        product = get_object_or_404(Product, product_uuid=product_uuid)
        variant = get_object_or_404(ProductVariant, id=variant_id, product=product)
        attr_value = get_object_or_404(AttributeValue, id=attribute_value_id)

        images = request.FILES.getlist("images")
        media_link, _ = ProductVariantAttributeMedia.objects.get_or_create(
            variant=variant,
            attribute_value=attr_value
        )

        for img in images:
            product_image = ProductImage.objects.create(image=img)
            media_link.images.add(product_image)

        return Response({
            "variant_id": variant.id,
            "attribute_value": attr_value.value,
            "message": f"{len(images)} images uploaded successfully"
        }, status=201)
