# shipping/services.py
import requests
from django.conf import settings

class ShiprocketService:
    def __init__(self):
        self.base_url = settings.SHIPROCKET_BASE_URL
        self.token = self.get_token()

    def get_token(self):
        url = f"{self.base_url}/auth/login"
        res = requests.post(url, json={
            "email": settings.SHIPROCKET_EMAIL,
            "password": settings.SHIPROCKET_PASSWORD
        })
        return res.json().get("token")

    def create_order(self, order):
        url = f"{self.base_url}/orders/create/adhoc"
        headers = {"Authorization": f"Bearer {self.token}"}
        payload = {
            "order_id": str(order.id),
            "order_date": str(order.created_at.date()),
            "pickup_location": "Warehouse-1",
            "billing_customer_name": order.user.first_name,
            "billing_last_name": order.user.last_name,
            "billing_address": order.shipping_address.address_line,
            "billing_city": order.shipping_address.city,
            "billing_pincode": order.shipping_address.pincode,
            "billing_state": order.shipping_address.state,
            "billing_country": "India",
            "billing_phone": order.user.phone,
            "order_items": [
                {
                    "name": item.product.name,
                    "sku": item.variant.sku,
                    "units": item.quantity,
                    "selling_price": str(item.price)
                } for item in order.items.all()
            ],
            "payment_method": "Prepaid" if order.is_paid else "COD",
            "sub_total": str(order.total),
            "length": 10,
            "breadth": 10,
            "height": 10,
            "weight": 0.5
        }
        res = requests.post(url, json=payload, headers=headers)
        return res.json()

    def track_order(self, awb_code):
        url = f"{self.base_url}/courier/track/awb/{awb_code}"
        headers = {"Authorization": f"Bearer {self.token}"}
        return requests.get(url, headers=headers).json()
