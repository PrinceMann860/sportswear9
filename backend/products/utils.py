from attributes.models import AttributeValue, ProductVariant

def generate_product_variants(product, color_values, size_values):
    for color in color_values:
        for size in size_values:
            variant = ProductVariant.objects.create(
                product=product,
                sku=f"{product.product_uuid}-{color.value[:3]}-{size.value}",
                price=product.price,
                net=product.net,
                is_default=False
            )
            variant.attributes.add(color, size)
            variant.save()
