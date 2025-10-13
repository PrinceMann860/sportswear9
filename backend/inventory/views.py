# inventory/views.py
from rest_framework import generics, permissions
from .models import Inventory
from .serializers import InventorySerializer


# --- Admin CRUD Views ---

class InventoryListCreateAPIView(generics.ListCreateAPIView):
    queryset = Inventory.objects.select_related("product", "variant")
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAdminUser]


class InventoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.select_related("product", "variant")
    serializer_class = InventorySerializer
    permission_classes = [permissions.IsAdminUser]


# --- Public Read View (for product/variant stock info) ---

class PublicInventoryAPIView(generics.RetrieveAPIView):
    queryset = Inventory.objects.filter(is_available=True).select_related("product", "variant")
    serializer_class = InventorySerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "inventory_uuid"
