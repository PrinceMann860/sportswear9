from rest_framework import serializers
from .models import UserProfile, Address


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)
    is_active = serializers.BooleanField(source="user.is_active", read_only=True)
    country = serializers.CharField(read_only=True)
    locale = serializers.CharField(read_only=True)
    
    
    class Meta:
        model = UserProfile
        fields = ["full_name", "email", "is_active", "gender", "phoneNumber", "country", "locale"]


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = "__all__"
        read_only_fields = ["user"]
