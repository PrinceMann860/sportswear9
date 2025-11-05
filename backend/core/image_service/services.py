import os
from urllib.parse import urljoin
from django.conf import settings

def get_imgproxy_url(original_url, width=800, fmt="webp", quality=80):
    """
    Temporary simple version — returns direct Django media URL
    without using Imgproxy.
    """
    if not original_url:
        return ""
    
    # Ensure absolute media URL
    if original_url.startswith("http"):
        return original_url
    
    return urljoin(settings.MEDIA_URL, original_url)
