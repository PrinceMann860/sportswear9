# products/admin.py

from django.contrib import admin
from .models import Product
from attributes.models import ProductVariant
from assets.models import ProductImage
from ProductSpecification.models import ProductSpecification

# Inline for Product Images
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ['image', 'is_main', 'alt_text']
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="50" height="50" />'
        return "-"
    preview.allow_tags = True
    preview.short_description = "Preview"

# Inline for Product Variants
class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1
    show_change_link = True

# Inline for Product Specifications
class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1

# Product Admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'product_uuid', 'category', 'brand', 'price', 'disc', 'net', 'is_featured', 'is_active', 'created_at']
    list_filter = ['is_featured', 'is_active', 'category', 'brand', 'created_at']
    search_fields = ['name', 'product_uuid', 'brand__name', 'category__name']
    readonly_fields = ['product_uuid', 'net', 'created_at', 'updated_at']
    inlines = [ProductVariantInline, ProductSpecificationInline]

    fieldsets = (
        (None, {
            'fields': ('product_uuid', 'name', 'description', 'category', 'brand')
        }),
        ("Pricing", {
            'fields': ('price', 'disc', 'net')
        }),
        ("Status", {
            'fields': ('is_featured', 'is_active', 'created_at', 'updated_at')
        }),
    )
