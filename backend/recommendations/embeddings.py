# recommendations/embeddings.py
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def get_product_embedding(product):
    """Generate vector embedding for a product based on its textual data."""
    text = f"{product.name}. {product.description or ''}. {product.category.name if product.category else ''}"
    return model.encode(text)

