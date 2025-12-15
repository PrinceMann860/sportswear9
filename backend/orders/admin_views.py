from rest_framework import generics, permissions
from .models import Order
from .serializers import OrderSerializer

class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser

class AdminOrderListView(generics.ListAPIView):
    queryset = Order.objects.select_related('user').prefetch_related('items__variant')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = 'order_uuid'
