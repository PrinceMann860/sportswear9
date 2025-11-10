from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from decimal import Decimal
from django.conf import settings

from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from attributes.models import ProductVariant
from inventory.models import Inventory
from orders.models import Order, OrderItem
from products.models import ProductCoupon, CouponUsage


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart

    def list(self, request, *args, **kwargs):
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    # ============================================================
    # 🛒 ADD ITEM TO CART
    # ============================================================
    @action(detail=False, methods=["post"], url_path="add")
    def add_item(self, request):
        """
        Add an item to the user's cart.
        Supports: product_uuid + variant_id (+ color_id optional)
        """
        product_uuid = request.data.get("product_uuid")
        variant_id = request.data.get("variant_id")
        color_id = request.data.get("color_id")  # optional
        quantity = int(request.data.get("quantity", 1))

        if not variant_id or not product_uuid:
            return Response({"error": "Both 'product_uuid' and 'variant_id' are required."}, status=400)

        # Retrieve variant
        try:
            variant = ProductVariant.objects.select_related("product").get(
                id=variant_id, product__product_uuid=product_uuid
            )
        except ProductVariant.DoesNotExist:
            return Response({"error": "Product variant not found."}, status=404)

        # Optional color validation
        if color_id and hasattr(variant, "color") and variant.color:
            if str(variant.color.color_id) != str(color_id):
                return Response({"error": "Color mismatch for this variant."}, status=400)

        # Stock check
        try:
            inventory = Inventory.objects.get(variant=variant)
        except Inventory.DoesNotExist:
            return Response({"error": "No inventory record for this variant."}, status=400)

        if quantity > inventory.available_stock:
            return Response(
                {"error": f"Insufficient stock. Requested {quantity}, available {inventory.available_stock}."},
                status=400
            )

        cart, _ = Cart.objects.get_or_create(user=request.user)
        item, created = CartItem.objects.get_or_create(
            cart=cart, variant=variant, defaults={"quantity": 0}
        )
        item.quantity += quantity
        item.save()

        serializer = CartItemSerializer(item, context={"request": request})
        return Response({
            "message": "Item added to cart successfully",
            "cart_item": serializer.data
        }, status=201)

    # ============================================================
    # 🎟️ APPLY COUPON
    # ============================================================
    @action(detail=False, methods=["post"], url_path="apply-coupon")
    def apply_coupon(self, request):
        """
        Apply a coupon to the user's cart.
        """
        code = request.data.get("code")
        if not code:
            return Response({"error": "Coupon code is required."}, status=400)

        try:
            coupon = ProductCoupon.objects.get(code__iexact=code)
        except ProductCoupon.DoesNotExist:
            return Response({"error": "Invalid coupon code."}, status=404)

        if not coupon.is_valid():
            return Response({"error": "Coupon is not active or expired."}, status=400)

        # Check user usage
        if CouponUsage.objects.filter(user=request.user, coupon=coupon).exists():
            return Response({"error": "You have already used this coupon."}, status=400)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart.coupon = coupon
        cart.save()

        serializer = self.get_serializer(cart)
        return Response({
            "message": f"Coupon '{coupon.code}' applied successfully!",
            "cart": serializer.data
        }, status=200)

    # ============================================================
    # 💳 CHECKOUT
    # ============================================================
    @action(detail=False, methods=["post"], url_path="checkout")
    def checkout(self, request):
        """
        Secure checkout:
        - Locks inventory
        - Validates stock
        - Applies coupon + fees
        - Creates order + order items
        - Deducts stock
        """
        user = request.user
        cart = self.get_object()
        items = list(cart.items.select_related("variant", "variant__product").all())

        if not items:
            return Response({"error": "Cart is empty."}, status=400)

        variant_ids = [item.variant.id for item in items]

        try:
            with transaction.atomic():
                inventories = (
                    Inventory.objects.select_for_update()
                    .filter(variant__id__in=variant_ids)
                    .select_related("variant")
                )
                inv_map = {inv.variant.id: inv for inv in inventories}

                # Validate stock
                for item in items:
                    inv = inv_map.get(item.variant.id)
                    if not inv:
                        raise ValueError(f"No inventory for variant {item.variant.sku}")
                    if item.quantity > inv.available_stock:
                        raise ValueError(
                            f"Insufficient stock for {item.variant.sku} "
                            f"(requested {item.quantity}, available {inv.available_stock})"
                        )

                # Create Order
                order = Order.objects.create(user=user, total_amount=0)
                total = Decimal("0.00")

                for item in items:
                    inv = inv_map[item.variant.id]
                    inv.reduce_stock(item.quantity)

                    price = Decimal(item.variant.effective_price)
                    subtotal = price * item.quantity

                    OrderItem.objects.create(
                        order=order,
                        variant=item.variant,
                        quantity=item.quantity,
                        price=price,
                        subtotal=subtotal,
                    )
                    total += subtotal

                # Apply coupon
                discount = cart.discount_amount
                total_after_discount = total - discount

                # Apply fees
                fees = cart.total_fees
                final_total = total_after_discount + fees

                # Save final total
                order.total_amount = max(final_total, Decimal("0.00"))
                order.save()

                # Record coupon usage
                if cart.coupon:
                    CouponUsage.objects.create(user=user, coupon=cart.coupon)
                    cart.coupon.used_count += 1
                    cart.coupon.save()

                # Clear cart
                cart.clear()

                return Response({
                    "message": "Order placed successfully",
                    "order_uuid": order.order_uuid,
                    "discount": str(discount),
                    "fees": str(fees),
                    "final_total": str(order.total_amount)
                }, status=200)

        except ValueError as e:
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            return Response(
                {"error": "Checkout failed", "detail": str(e)},
                status=500
            )


# ============================================================
# 🧾 CART ITEM VIEWSET
# ============================================================
class CartItemViewSet(viewsets.ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CartItem.objects.filter(
            cart__user=self.request.user
        ).select_related("variant", "variant__product")

    def perform_create(self, serializer):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        variant = serializer.validated_data["variant"]

        try:
            inventory = Inventory.objects.get(variant=variant)
        except Inventory.DoesNotExist:
            raise serializers.ValidationError("No inventory record for this variant.")

        requested_qty = serializer.validated_data.get("quantity", 1)

        item, created = CartItem.objects.get_or_create(
            cart=cart, variant=variant, defaults={"quantity": 0}
        )
        new_qty = item.quantity + requested_qty

        if new_qty > inventory.available_stock:
            raise serializers.ValidationError(
                f"Requested quantity ({new_qty}) exceeds available stock ({inventory.available_stock})."
            )

        item.quantity = new_qty
        item.save()
        self.instance = item

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        out_serializer = CartItemSerializer(self.instance, context={"request": request})
        return Response(out_serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        inventory = Inventory.objects.filter(variant=instance.variant).first()
        if not inventory:
            return Response({"error": "Inventory not found for variant."}, status=400)

        if serializer.validated_data.get("quantity", instance.quantity) > inventory.available_stock:
            return Response({"error": "Insufficient stock."}, status=400)

        self.perform_update(serializer)
        return Response(self.get_serializer(instance).data)
