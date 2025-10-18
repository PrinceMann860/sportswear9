# reviews/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from .permissions import IsOwnerOrAdmin

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrAdmin]

    def get_queryset(self):
        product_id = self.request.query_params.get("product_id")
        if product_id:
            return Review.objects.filter(product_id=product_id).select_related("user", "product")
        return Review.objects.all().select_related("user", "product")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
