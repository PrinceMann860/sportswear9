from celery import shared_task
from .embeddings import get_product_embedding
from .vector_store import save_embedding, get_all_embeddings
from products.models import Product
from django.core.cache import cache

@shared_task
def index_product_embeddings(batch_size: int = 500):
    """
    Index embeddings for all products. Chunk so it doesn't blow memory.
    Use this as a periodic task (cron) or trigger on product updates.
    """
    qs = Product.objects.all().only("id", "name", "description", "category_id")
    ids = list(qs.values_list("id", flat=True))

    # chunk to avoid loading all products at once
    for i in range(0, len(ids), batch_size):
        chunk_ids = ids[i : i + batch_size]
        chunk_products = Product.objects.filter(id__in=chunk_ids).only("id", "name", "description", "category_id").select_related("category")
        for p in chunk_products:
            try:
                emb = get_product_embedding(p)
                save_embedding(p.id, emb)
            except Exception:
                # log in real app
                continue

    # ensure cached all-embeddings is invalidated (vector_store.save_embedding does this)
    cache_key = "recommendations:all_embeddings_cache"
    cache.delete(cache_key)
