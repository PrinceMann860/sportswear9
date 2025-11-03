from celery import shared_task
from shipping.services import ShiprocketService

@shared_task
def create_shipping_order_task(order_id):
    from orders.models import Order
    order = Order.objects.get(id=order_id)
    service = ShiprocketService()
    response = service.create_order(order)
    if "awb_code" in response:
        order.awb_code = response["awb_code"]
        order.save()
    return response
