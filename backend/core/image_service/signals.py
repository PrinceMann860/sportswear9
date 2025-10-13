# core/image_service/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import BaseImage
from .utils import generate_variants

@receiver(post_save)
def create_image_variants(sender, instance, created, **kwargs):
    if not issubclass(sender, BaseImage):
        return  # only process BaseImage subclasses
    if created and instance.image:
        instance.variants = generate_variants(instance.image)
        instance.save(update_fields=["variants"])
