from django.contrib import admin
from .models import Attribute, AttributeValue, ProductAttribute, ProductVariant

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']


@admin.register(AttributeValue)
class AttributeValueAdmin(admin.ModelAdmin):
    list_display = ['attribute', 'value']
    list_filter = ['attribute']
    search_fields = ['value']


@admin.register(ProductAttribute)
class ProductAttributeAdmin(admin.ModelAdmin):
    list_display = ['product', 'attribute']
    list_filter = ['attribute']
    search_fields = ['product__name', 'attribute__name']


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['product', 'sku', 'price', 'is_default']
    list_filter = ['is_default']
    search_fields = ['product__name', 'sku']
    filter_horizontal = ['attributes']  # To allow multiple selection with checkboxes
