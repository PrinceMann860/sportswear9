from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PaymentViewSet
from .webhooks import razorpay_webhook

router = DefaultRouter()
router.register('payments', PaymentViewSet, basename='payments')

urlpatterns = router.urls + [
    path('webhooks/razorpay/', razorpay_webhook, name='razorpay-webhook'),
]
