import os
from urllib.parse import quote

from django.conf import settings

IMGPROXY_BASE = os.getenv("IMGPROXY_URL", "http://localhost:8080")

def get_imgproxy_url(original_url, width=800, fmt="webp"):
    """
    Generate dynamic imgproxy URL for optimized delivery.
    Example: /insecure/rs:fit:800:0/format:webp/plain/<original_url>
    """
    if not original_url:
        return ""
    encoded_url = quote(original_url, safe='')
    return f"{IMGPROXY_BASE}/insecure/rs:fit:{width}:0/format:{fmt}/plain/{encoded_url}"
