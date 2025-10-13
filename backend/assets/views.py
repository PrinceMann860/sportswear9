from rest_framework import viewsets, permissions
from .models import ProductImage, ProductVideo
from .serializers import ProductImageSerializer, ProductVideoSerializer

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

class ProductVideoViewSet(viewsets.ModelViewSet):
    queryset = ProductVideo.objects.all()
    serializer_class = ProductVideoSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]
