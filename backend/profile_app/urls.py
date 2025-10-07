from django.urls import path
from .views import ProfileView, AddressListCreateView, AddressDetailView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
]
