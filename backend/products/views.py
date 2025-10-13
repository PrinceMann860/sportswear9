from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product
from .serializers import ProductListSerializer, ProductDetailSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

@method_decorator(cache_page(60 * 5), name="dispatch")  # cache 5 min
class ProductListAPIView(generics.ListAPIView):
    """
    Public & user endpoint: returns paginated product list with filters and search
    """
    queryset = Product.objects.filter(is_active=True).select_related('brand', 'category')
    serializer_class = ProductListSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication here so JWT is NOT required
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'is_featured']
    search_fields = ['name', 'description', 'brand__name', 'category__name']
    ordering_fields = ['price', 'created_at']


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True).select_related(
        'brand', 'category'
    ).prefetch_related(
        'variants__images',
        'inventory',
        'reviews',
        'specifications'
    )
    serializer_class = ProductDetailSerializer
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication here so JWT is NOT required
    lookup_field = 'product_uuid'

    def get_object(self):
        obj = super().get_object()
        color = self.request.query_params.get('color')
        if color:
            # Optional filtering by color (variant)
            variant = obj.variants.filter(color_name__iexact=color).first()
            if variant:
                # Attach the color-filtered variant to context
                self.variant = variant
        return obj

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['variant'] = getattr(self, 'variant', None)
        return context
