from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db import models
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from .models import RecentlyViewed, ProductBundle
from .serializers import (
    RecentlyViewedSerializer,
    ProductBundleSerializer,
    AISuggestedProductSerializer,
)
from products.models import Product
from products.serializers import ProductListSerializer

# AI + Redis imports
from .vector_store import get_all_embeddings
from .embeddings import get_product_embedding


# -----------------------------
# RECENTLY VIEWED API
# -----------------------------
class RecentlyViewedListAPIView(generics.ListAPIView):
    serializer_class = RecentlyViewedSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user if self.request.user.is_authenticated else None
        session_key = self.request.session.session_key or self.request.session.create()

        if user:
            qs = RecentlyViewed.objects.filter(user=user)
        else:
            qs = RecentlyViewed.objects.filter(session_key=session_key)

        return qs.select_related("product").order_by("-viewed_at")[:20]


# -----------------------------
# AI-BASED SUGGESTIONS API
# -----------------------------
class AISuggestionListAPIView(generics.ListAPIView):
    """
    AI-based recommendation system using semantic embeddings + Redis vector store.
    Recommends similar products based on product meaning, not just category.
    """
    serializer_class = AISuggestedProductSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        product_id = self.kwargs.get("product_id")
        all_embeddings = get_all_embeddings()

        if not all_embeddings or int(product_id) not in all_embeddings:
            return Response([])

        # Target product vector
        target_vec = all_embeddings[int(product_id)].reshape(1, -1)
        product_ids = list(all_embeddings.keys())
        vectors = np.stack(list(all_embeddings.values()))

        # Compute cosine similarity
        similarities = cosine_similarity(target_vec, vectors)[0]
        top_indices = np.argsort(similarities)[::-1][1:10]
        top_ids = [product_ids[i] for i in top_indices]

        products = Product.objects.filter(id__in=top_ids)
        product_map = {p.id: p for p in products}

        data = [
            {"product": product_map[pid], "score": float(similarities[i])}
            for i, pid in enumerate(product_ids)
            if pid in product_map
        ]
        data = sorted(data, key=lambda x: x["score"], reverse=True)[:10]
        serializer = self.get_serializer(data, many=True)
        return Response(serializer.data)


# -----------------------------
# COMPLETE THE LOOK (AI + RULES)
# -----------------------------
class AICompleteLookListAPIView(generics.ListAPIView):
    """
    Hybrid AI + rule-based recommendations to suggest complementary products
    that complete a purchase (e.g., shoes + socks + accessories).
    """
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs.get("product_id")
        all_embeddings = get_all_embeddings()

        try:
            main = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Product.objects.none()

        if not all_embeddings or main.id not in all_embeddings:
            return Product.objects.none()

        main_vec = all_embeddings[main.id].reshape(1, -1)
        product_ids = list(all_embeddings.keys())
        vectors = np.stack(list(all_embeddings.values()))
        similarities = cosine_similarity(main_vec, vectors)[0]

        # Filter out same product and same category for complementary items
        diff_cat = Product.objects.exclude(category=main.category)
        diff_ids = [p.id for p in diff_cat]

        ranked = [(pid, sim) for pid, sim in zip(product_ids, similarities) if pid in diff_ids]
        ranked.sort(key=lambda x: x[1], reverse=True)
        top_ids = [pid for pid, _ in ranked[:5]]

        return Product.objects.filter(id__in=top_ids)
