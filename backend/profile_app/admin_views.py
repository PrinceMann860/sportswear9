from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from auth_app.serializers import RegisterSerializer  # reuse or create an admin version
from .models import UserProfile, Address
from .serializers import UserProfileSerializer, AddressSerializer

User = get_user_model()

class IsAdmin(permissions.BasePermission):
    """Custom permission to allow only admin/staff users."""
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)


# 🧑‍💼 Admin: List + Create Users
class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = RegisterSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request, *args, **kwargs):
        users = User.objects.all().select_related("profile")
        data = [
            {
                "user_uuid": user.user_uuid,
                "email": user.email,
                "is_active": user.is_active,
                "is_staff": user.is_staff,
                "date_joined": user.date_joined,
                "profile": UserProfileSerializer(user.profile).data if hasattr(user, "profile") else None,
            }
            for user in users
        ]
        return Response(data)

# 🧑‍💼 Admin: Retrieve / Update / Delete Single User
class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = "user_uuid"

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        profile = getattr(user, "profile", None)
        data = {
            "user_uuid": user.user_uuid,
            "email": user.email,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "profile": UserProfileSerializer(profile).data if profile else None,
        }
        return Response(data)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.delete()
        return Response({"detail": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


# 📦 Admin: View All Addresses (across users)
class AdminAddressListView(generics.ListAPIView):
    queryset = Address.objects.select_related("user__user").all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


# 📦 Admin: View/Edit/Delete Individual Address
class AdminAddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.select_related("user__user").all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    lookup_field = "address_id"
