# specifications/views.py
from rest_framework import generics, permissions
from .models import Specification, ProductSpecification
from .serializers import SpecificationSerializer, ProductSpecificationSerializer


# ------------- Admin CRUD for global specifications -------------

class SpecificationListCreateView(generics.ListCreateAPIView):
    queryset = Specification.objects.all()
    serializer_class = SpecificationSerializer
    permission_classes = [permissions.IsAdminUser]


class SpecificationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specification.objects.all()
    serializer_class = SpecificationSerializer
    permission_classes = [permissions.IsAdminUser]


# ------------- Product-specific specifications -------------

class ProductSpecificationListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSpecificationSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        product_uuid = self.kwargs.get("product_uuid")
        return ProductSpecification.objects.filter(product__product_uuid=product_uuid)

    def perform_create(self, serializer):
        product_uuid = self.kwargs.get("product_uuid")
        serializer.save(product_id=product_uuid)
