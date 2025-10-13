from rest_framework import generics, permissions
from .models import Brand
from .serializers import BrandSerializer
from rest_framework.permissions import IsAdminUser


# --- Public: List all brands ---
class BrandListAPIView(generics.ListAPIView):
    queryset = Brand.objects.all().order_by("name")
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]  # Public access


# --- Public: Retrieve brand by UUID ---
class BrandDetailAPIView(generics.RetrieveAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'brand_uuid'
    lookup_url_kwarg = 'brand_uuid'


# --- Admin: Create brand ---
class BrandCreateAPIView(generics.CreateAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminUser]

# --- Admin: Update/Delete brand ---
class AdminBrandDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [IsAdminUser]
    lookup_field = 'brand_uuid'
    lookup_url_kwarg = 'brand_uuid'
