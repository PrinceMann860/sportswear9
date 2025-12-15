from rest_framework import generics, permissions
from django.db.models import Prefetch, Count, Sum

from .models import Order, OrderItem
from .serializers import OrderSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser



class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_staff or request.user.is_superuser


class AdminOrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    
    def get_queryset(self):
        """Optimized admin order list with annotations"""
        return Order.objects.select_related(
            'user'
        ).prefetch_related(
            Prefetch(
                'items',
                queryset=OrderItem.objects.select_related(
                    'variant__product__brand'
                ).only(
                    'id', 'order_id', 'quantity', 'price', 'subtotal',
                    'variant__id', 'variant__sku',
                    'variant__product__id', 'variant__product__name',
                    'variant__product__brand__id', 'variant__product__brand__name'
                )
            ),
            'payments'
        ).annotate(
            items_count=Count('items'),
            payments_count=Count('payments')
        ).only(
            'order_uuid', 'user__email', 'total_amount', 'status',
            'created_at', 'updated_at'
        ).order_by('-created_at')


class AdminOrderDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = 'order_uuid'
    
    def get_queryset(self):
        """Optimized single order fetch"""
        return OrderSerializer.setup_eager_loading(
            Order.objects.all()
        )
