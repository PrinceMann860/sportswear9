from django.db import models
from backend.storage_backends import MediaStorage

class BaseImage(models.Model):
    image = models.ImageField(upload_to='uploads/products/', storage=MediaStorage())
    alt_text = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.alt_text or self.image.name

    @property
    def original_url(self):
        """Public media URL for the master image"""
        if self.image:
            return self.image.url
        return ""
