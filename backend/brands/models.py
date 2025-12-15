from django.db import models
from shortuuid.django_fields import ShortUUIDField


class Brand(models.Model):
    brand_uuid = ShortUUIDField(length=12, alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', prefix='BRD-', unique=True, editable=False)
    name = models.CharField(max_length=255, unique=True)
    logo = models.FileField(upload_to="brand_logos/", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.logo:
            print("Saved file at:", self.logo.path)

    def __str__(self):
        return self.name
