from django.db import models
from shortuuid.django_fields import ShortUUIDField
from backend.storage_backends import MediaStorage

# Level of the homepage (e.g., Level 1, Level 2)
class HomePageLevel(models.Model):
    level_uuid = ShortUUIDField(length=10, prefix="LVL-", alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", unique=True, editable=False)
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


# Section within a level (carousel, video, etc.)
class HomePageSection(models.Model):
    section_uuid = ShortUUIDField(length=12, prefix="SEC-", alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", unique=True, editable=False)
    level = models.ForeignKey(HomePageLevel, related_name='sections', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    section_type = models.CharField(max_length=50, choices=[
        ("carousel", "Carousel"),
        ("grid", "Grid"),
        ("video", "Video"),
        ("filter", "Filter"),
        ("deals", "Deals")
    ])
    order = models.PositiveIntegerField(default=0)
    extra_config = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title


# Items inside a section (images, videos, links)
class SectionItem(models.Model):
    item_uuid = ShortUUIDField(length=14, prefix="ITM-", alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", unique=True, editable=False)
    section = models.ForeignKey(HomePageSection, related_name='items', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='homepage/', storage=MediaStorage())
    title = models.CharField(max_length=255, blank=True)
    subtitle = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    link = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title or f"Item {self.item_uuid}"
