# core/image_service/image_config.py

IMAGE_VARIANTS = {
    "thumbnail": {"width": 150, "quality": 60},
    "small": {"width": 300, "quality": 70},
    "medium": {"width": 720, "quality": 80},
    "large": {"width": 1200, "quality": 85},
    "full": {"width": 1920, "quality": 90},
}

IMAGE_FORMATS = ["webp", "jpg"]
PRODUCT_IMAGE_PRESETS = ["thumbnail", "medium", "large"]
BRAND_LOGO_PRESETS = ["small", "medium"]
