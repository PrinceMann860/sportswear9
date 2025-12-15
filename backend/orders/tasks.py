from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from cart.models import Cart, CartItem
from .models import Order, OrderItem

User = get_user_model()


@shared_task(bind=True)
def create_order_from_cart_task(self, user_id, shipping_address):
    """
    Async order creation using RabbitMQ worker.
    Applies fees + discount + clears cart.
    """
    try:
        user = User.objects.get(id=user_id)
        cart = Cart.objects.get(user=user)

        # 🧾 Compute subtotal
        subtotal = 0
        total_items = 0

        for item in cart.items.all():
            subtotal += float(item.variant.effective_price) * item.quantity
            total_items += item.quantity

        # 💸 Apply fees from settings
        handling_fee = getattr(settings, "HANDLING_FEE", 0)
        delivery_fee = getattr(settings, "DELIVERY_FEE", 0)
        rain_fee = getattr(settings, "RAIN_SURGE_FEE", 0)
        other_fee = getattr(settings, "OTHER_FEE", 0)
        free_threshold = getattr(settings, "FREE_DELIVERY_THRESHOLD", 500)

        # 🚫 Skip delivery/rain fees if subtotal exceeds threshold
        if subtotal >= free_threshold:
            delivery_fee = 0
            rain_fee = 0
            handling_fee = 0

        total_fees = handling_fee + delivery_fee + rain_fee + other_fee

        # 🧮 Final total
        total_amount = subtotal + total_fees

        # 🎟️ Apply discount if any token applied
        discount_amount = getattr(cart, "discount_amount", 0)
        if discount_amount:
            total_amount -= discount_amount

        # 🧾 Create order
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

        # 🛒 Copy cart items → order items
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                variant=item.variant,
                quantity=item.quantity,
                price=item.variant.effective_price,
                subtotal=item.variant.effective_price * item.quantity
            )

        # 🧹 Clear cart after success
        cart.items.all().delete()

        return {"order_uuid": str(order.order_uuid), "total": total_amount}

    except Exception as e:
        return {"error": str(e)}
