# recommendations/tasks.py
from celery import shared_task
from .embeddings import get_product_embedding
from .vector_store import save_embedding
from products.models import Product

@shared_task
def index_product_embeddings():
    """
    Generate and store vector embeddings for all products asynchronously.
    Run periodically to keep recommendations fresh.
    """
    for p in Product.objects.all():
        embedding = get_product_embedding(p)
        save_embedding(p.id, embedding)
