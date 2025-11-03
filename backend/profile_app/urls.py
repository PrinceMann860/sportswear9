from django.urls import path
from .views import ProfileView, AddressListCreateView, AddressDetailView
from .address import PincodeInfoView

from .admin_views import (
    AdminUserListCreateView,
    AdminUserDetailView,
    AdminAddressListView,
    AdminAddressDetailView,
)

urlpatterns = [
    path("me/", ProfileView.as_view(), name="user-profile"),
    path("addresses/", AddressListCreateView.as_view(), name="address-list-create"),
    path("addresses/<uuid:pk>/", AddressDetailView.as_view(), name="address-detail"),
    path('address/locality/', PincodeInfoView.as_view(), name='pincode-info'),
]

urlpatterns += [
    # Admin user management
    path("admin/users/", AdminUserListCreateView.as_view(), name="admin-user-list-create"),
    path("admin/users/<str:user_uuid>/", AdminUserDetailView.as_view(), name="admin-user-detail"),

    # Admin address management
    path("admin/addresses/", AdminAddressListView.as_view(), name="admin-address-list"),
    path("admin/addresses/<uuid:address_id>/", AdminAddressDetailView.as_view(), name="admin-address-detail"),
]