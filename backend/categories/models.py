from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from shortuuid.django_fields import ShortUUIDField
from django.utils.text import slugify

class Category(MPTTModel):
    category_uuid = ShortUUIDField(length=12, alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', prefix='CAT-', unique=True, editable=False)
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(unique=True, blank=True)  # allow blank here; will auto-generate
    parent = TreeForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    is_active = models.BooleanField(default=True)

    class MPTTMeta:
        order_insertion_by = ["name"]

    def save(self, *args, **kwargs):
        if not self.slug or self.name_has_changed():  # Optional enhancement
            base_slug = slugify(self.name)
            slug = base_slug
            count = 1
            while Category.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{count}"
                count += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def name_has_changed(self):
        if not self.pk:
            return True
        old_name = Category.objects.get(pk=self.pk).name
        return self.name != old_name
    
    def get_ancestors_slugs(self):
        return " > ".join([ancestor.name for ancestor in self.get_ancestors(include_self=True)])
