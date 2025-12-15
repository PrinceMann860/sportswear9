from rest_framework import generics, permissions
from rest_framework.response import Response
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.db import models

from .models import RecentlyViewed, ProductBundle
from .serializers import (
    RecentlyViewedSerializer,
    ProductBundleSerializer,
    AISuggestedProductSerializer,
)
from products.models import Product
from products.serializers import ProductListSerializer

from .vector_store import get_all_embeddings, get_embedding
from .embeddings import get_product_embedding
from django.core.cache import cache

# Constants
AI_TOP_K = 9  # return top 9 similar (excluding self)
AI_COMPLETE_LOOK_K = 5

# -----------------------------
# RECENTLY VIEWED API (auth only)
# -----------------------------
class RecentlyViewedListAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            RecentlyViewed.objects
            .filter(user=self.request.user)
            .select_related("product__brand", "product__category")
            .only(
                "viewed_at",
                "product__product_uuid",
                "product__name",
                "product__price",
                "product__net",
                "product__disc",
                "product__brand__name",
                "product__category__name",
            )
            .order_by("-viewed_at")[:20]
        )

# -----------------------------
# AI-BASED SUGGESTIONS API
# -----------------------------
class AISuggestionListAPIView(generics.ListAPIView):
    """
    Recommends semantically similar products using embeddings.
    """
    serializer_class = AISuggestedProductSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        try:
            product_id = int(self.kwargs.get("product_id"))
        except (TypeError, ValueError):
            return Response([])

        # Try to fetch single embedding first (fast check)
        target_emb = get_embedding(product_id)
        if target_emb is None:
            # fallback: load all embeddings (cached) and check
            all_embeddings = get_all_embeddings()
            if not all_embeddings or product_id not in all_embeddings:
                return Response([])
            product_ids = list(all_embeddings.keys())
            vectors = np.vstack([all_embeddings[pid] for pid in product_ids])
            target_emb = all_embeddings[product_id]
        else:
            # We still need the other vectors for similarity; load cached all embeddings
            all_embeddings = get_all_embeddings()
            if not all_embeddings or product_id not in all_embeddings:
                return Response([])  # if cache empty or missing, bail; consider indexing
            product_ids = list(all_embeddings.keys())
            vectors = np.vstack([all_embeddings[pid] for pid in product_ids])

        # compute similarity
        target_vec = target_emb.reshape(1, -1)
        similarities = cosine_similarity(target_vec, vectors)[0]

        # top indices (descending), skip self
        sorted_idx = np.argsort(similarities)[::-1]
        top_indices = [i for i in sorted_idx if product_ids[i] != product_id][:AI_TOP_K]

        top_ids = [product_ids[i] for i in top_indices]
        top_scores = [float(similarities[i]) for i in top_indices]

        # fetch products and build map
        products = Product.objects.filter(id__in=top_ids).only(
            "id", "product_uuid", "name", "net", "price", "brand_id", "category_id"
        )
        product_map = {p.id: p for p in products}

        # preserve order of top_ids
        results = []
        for pid, score in zip(top_ids, top_scores):
            prod = product_map.get(pid)
            if prod:
                results.append({"product": prod, "score": score})

        serializer = self.get_serializer(results, many=True)
        return Response(serializer.data)


# -----------------------------
# COMPLETE THE LOOK (AI + RULES)
# -----------------------------
class AICompleteLookListAPIView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        try:
            product_id = int(self.kwargs.get("product_id"))
        except (TypeError, ValueError):
            return Product.objects.none()

        # check product exists
        try:
            main = Product.objects.only("id", "category_id").get(id=product_id)
        except Product.DoesNotExist:
            return Product.objects.none()

        all_embeddings = get_all_embeddings()
        if not all_embeddings or main.id not in all_embeddings:
            return Product.objects.none()

        product_ids = list(all_embeddings.keys())
        vectors = np.vstack([all_embeddings[pid] for pid in product_ids])
        main_vec = all_embeddings[main.id].reshape(1, -1)
        similarities = cosine_similarity(main_vec, vectors)[0]

        # if main has category, exclude same-category products; otherwise exclude only the product itself
        if main.category_id:
            candidate_qs = Product.objects.exclude(category_id=main.category_id).only("id")
            diff_ids = set(candidate_qs.values_list("id", flat=True))
        else:
            diff_ids = set([pid for pid in product_ids if pid != main.id])

        # build ranked list
        ranked = [(pid, sim) for pid, sim in zip(product_ids, similarities) if pid in diff_ids and pid != main.id]
        ranked.sort(key=lambda x: x[1], reverse=True)
        top_ids = [pid for pid, _ in ranked[:AI_COMPLETE_LOOK_K]]

        return Product.objects.filter(id__in=top_ids).only(
            "id", "product_uuid", "name", "net", "price", "brand_id", "category_id"
        )
