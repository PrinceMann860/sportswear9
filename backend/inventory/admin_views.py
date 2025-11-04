# inventory/admin_views.py
from rest_framework import generics, permissions
from .models import Inventory
from .admin_serializers import InventoryAdminSerializer

class InventoryListCreateAdminAPIView(generics.ListCreateAPIView):
    queryset = Inventory.objects.select_related("product", "variant")
    serializer_class = InventoryAdminSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        qs = super().get_queryset()
        product_uuid = self.request.query_params.get("product_uuid")
        if product_uuid:
            qs = qs.filter(product__product_uuid=product_uuid)
        return qs


class InventoryDetailAdminAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Inventory.objects.select_related("product", "variant")
    serializer_class = InventoryAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    lookup_field = "inventory_uuid"
