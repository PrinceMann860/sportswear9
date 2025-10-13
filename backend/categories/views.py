from rest_framework import generics, permissions
from .models import Category
from .serializers import CategorySerializer


# List all categories or create new ones
class CategoryListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True).prefetch_related("children")
    
# Retrieve, update, or delete a single category
class CategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
