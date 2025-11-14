from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import ProductSpecificationContent
from .serializers import ProductSpecificationContentSerializer


class ProductSpecificationContentViewSet(viewsets.ModelViewSet):
    """
    🔹 CRUD for Product Specification Content (dynamic JSON specs)
    - Admins: full CRUD (create, update, delete)
    - Public: read-only (list, retrieve)
    - Supports filtering by product_uuid via query param
    """
    serializer_class = ProductSpecificationContentSerializer
    lookup_field = "content_uuid"

    def get_queryset(self):
        """
        Allow optional filtering by product_uuid
        """
        queryset = ProductSpecificationContent.objects.select_related("product").prefetch_related("media")
        product_uuid = self.request.query_params.get("product_uuid")
        if product_uuid:
            queryset = queryset.filter(product__product_uuid=product_uuid)
        return queryset

    def get_permissions(self):
        """
        Restrict write actions to admins only
        """
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        """
        Admin: Create a new ProductSpecificationContent instance
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Admin: Update an existing ProductSpecificationContent instance
        """
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Admin: Delete an existing ProductSpecificationContent instance
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"detail": "Specification content deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
