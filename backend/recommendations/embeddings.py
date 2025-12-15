from sentence_transformers import SentenceTransformer
from typing import Dict
import numpy as np

_model = None

def get_model():
    global _model
    if _model is None:
        # lazy load the model once per process
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

def get_product_embedding(product) -> np.ndarray:
    """
    Generate vector embedding for a product based on its textual data.
    Keep the text concise (name + category + short description).
    """
    model = get_model()
    text = f"{product.name}. {product.description[:256] if product.description else ''}. {product.category.name if getattr(product, 'category', None) else ''}"
    emb = model.encode(text)
    return np.array(emb)
