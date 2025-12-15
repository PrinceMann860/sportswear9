import os
import redis
import json
import numpy as np
from django.core.cache import cache

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))
EMBED_HASH_KEY = os.getenv("EMBED_HASH_KEY", "product_embeddings")
ALL_EMBED_CACHE_KEY = "recommendations:all_embeddings_cache"
ALL_EMBED_CACHE_TTL = int(os.getenv("ALL_EMBED_CACHE_TTL", 30))  # seconds

_redis = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)

def save_embedding(product_id: int, embedding: np.ndarray):
    """Save embedding vector for a product (stores JSON array)."""
    _redis.hset(EMBED_HASH_KEY, product_id, json.dumps(np.array(embedding).tolist()))
    # Invalidate cached all-embeddings
    cache.delete(ALL_EMBED_CACHE_KEY)

def get_embedding(product_id: int):
    """Get embedding for a single product id, returns numpy array or None."""
    v = _redis.hget(EMBED_HASH_KEY, product_id)
    if not v:
        return None
    return np.array(json.loads(v))

def get_all_embeddings(force_refresh: bool = False):
    """
    Return {product_id: np.array(vector)}.
    Caches the parsed embeddings in Django cache for a short TTL to avoid repeated deserialization.
    """
    if not force_refresh:
        cached = cache.get(ALL_EMBED_CACHE_KEY)
        if cached is not None:
            return cached

    data = _redis.hgetall(EMBED_HASH_KEY)
    # decode and parse
    result = {}
    for k, v in data.items():
        try:
            result[int(k)] = np.array(json.loads(v))
        except Exception:
            # skip malformed data
            continue

    cache.set(ALL_EMBED_CACHE_KEY, result, ALL_EMBED_CACHE_TTL)
    return result

def get_all_product_ids():
    """Return list of all product ids present in embeddings (string list)."""
    return _redis.hkeys(EMBED_HASH_KEY)
