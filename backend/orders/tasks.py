from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from cart.models import Cart, CartItem
from .models import Order, OrderItem
from decimal import Decimal

User = get_user_model()


@shared_task(bind=True)
def create_order_from_cart_task(self, user_id, shipping_address):
    """
    Async order creation with optimized queries:
    - select_related for ForeignKeys
    - prefetch_related for reverse ForeignKeys
    - Atomic transaction for data integrity
    """
    try:
        with transaction.atomic():
            # Optimized user and cart fetch
            user = User.objects.only('id', 'email').get(id=user_id)
            cart = Cart.objects.prefetch_related(
                'items__variant__product'
            ).get(user=user)

            # Compute subtotal using annotation (database-level)
            from django.db.models import Sum, F
            cart_data = cart.items.aggregate(
                subtotal=Sum(F('variant__net') * F('quantity')),
                total_items=Sum('quantity')
            )
            
            subtotal = cart_data['subtotal'] or Decimal("0.00")
            total_items = cart_data['total_items'] or 0

            # Apply fees
            handling_fee = getattr(settings, "HANDLING_FEE", 0)
            delivery_fee = getattr(settings, "DELIVERY_FEE", 0)
            rain_fee = getattr(settings, "RAIN_SURGE_FEE", 0)
            other_fee = getattr(settings, "OTHER_FEE", 0)
            free_threshold = getattr(settings, "FREE_DELIVERY_THRESHOLD", 500)

            if subtotal >= free_threshold:
                delivery_fee = 0
                rain_fee = 0
                handling_fee = 0

            total_fees = handling_fee + delivery_fee + rain_fee + other_fee
            total_amount = subtotal + total_fees

            # Apply discount
            discount_amount = getattr(cart, "discount_amount", 0)
            if discount_amount:
                total_amount -= discount_amount

            # Create order
            order = Order.objects.create(
                user=user,
                subtotal=subtotal,
                total_items=total_items,
                handling_fee=handling_fee,
                delivery_fee=delivery_fee,
                rain_surge_fee=rain_fee,
                other_fee=other_fee,
                discount_amount=discount_amount,
                total_amount=total_amount,
                shipping_address=shipping_address,
                status="PENDING",
            )

            # Bulk create order items
            order_items = []
            for item in cart.items.select_related('variant'):
                order_items.append(
                    OrderItem(
                        order=order,
                        variant=item.variant,
                        quantity=item.quantity,
                        price=item.variant.net,
                        subtotal=item.variant.net * item.quantity
                    )
                )
            
            # Single bulk insert
            OrderItem.objects.bulk_create(order_items)

            # Clear cart
            cart.items.all().delete()

            return {"order_uuid": str(order.order_uuid), "total": total_amount}

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
