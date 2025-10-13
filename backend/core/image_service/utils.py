from PIL import Image
from django.core.exceptions import ValidationError

def validate_image(image_field):
    try:
        img = Image.open(image_field)
        img.verify()
        if img.format.lower() not in ["jpeg", "jpg", "png", "webp"]:
            raise ValidationError("Unsupported image format.")
    except Exception:
        raise ValidationError("Invalid image file.")
