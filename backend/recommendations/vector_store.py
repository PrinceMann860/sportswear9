# recommendations/vector_store.py
import redis
import numpy as np
import json

r = redis.Redis(host="localhost", port=6379, db=0)

def save_embedding(product_id, embedding):
    r.hset("product_embeddings", product_id, json.dumps(embedding.tolist()))

def get_all_embeddings():
    data = r.hgetall("product_embeddings")
    return {int(k): np.array(json.loads(v)) for k, v in data.items()}
