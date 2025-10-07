from django.urls import path
from .views import ProfileView, AddressListCreateView, AddressDetailView
from .address import PincodeInfoView

urlpatterns = [
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<int:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path('address/locality/', PincodeInfoView.as_view(), name='pincode-info'),
]
