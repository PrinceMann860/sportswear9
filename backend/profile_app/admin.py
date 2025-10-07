from django.contrib import admin
from .models import UserProfile, Address


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("full_name", "user_email", "gender", "phone")
    search_fields = ("full_name", "user__email", "phone")
    list_filter = ("gender",)
    readonly_fields = ("user",)

    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = "Email"
    user_email.admin_order_field = "user__email"


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "name", "mobile", "city", "state", "pincode", "address_type", "is_default", "user_profile"
    )
    search_fields = (
        "name", "mobile", "pincode", "city", "state", "user__full_name", "user__user__email"
    )
    list_filter = ("address_type", "is_default", "state", "city")
    readonly_fields = ("created_at", "updated_at")

    def user_profile(self, obj):
        return obj.user.full_name or obj.user.user.email
    user_profile.short_description = "User"
