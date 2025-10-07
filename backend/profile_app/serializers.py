from rest_framework import serializers
from .models import UserProfile, Address


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = UserProfile
        fields = ["email", "full_name", "gender", "phone", "profile_picture"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]
