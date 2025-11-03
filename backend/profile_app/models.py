from django.db import models
from django.conf import settings
import uuid
from django_countries.fields import CountryField

class UserProfile(models.Model):
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('N', 'Prefer not to say'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile"
    )
    full_name = models.CharField(max_length=255, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    phoneNumber = models.CharField(max_length=20, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    country = CountryField(blank=True, null=True)  # ← Add this
    locale = models.CharField(max_length=10, blank=True, null=True)   # e.g., "en-IN"

    def __str__(self):
        return f"{self.full_name or self.user.email}'s Profile"


class Address(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="addresses")
    address_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    address_name = models.CharField(max_length=100, choices=[("home", "Home"), ("work", "Work"), ("other", "Other")], default="other")

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100, blank=True, null=True)
    mobile = models.CharField(max_length=20)
    pincode = models.CharField(max_length=10)
    country = models.CharField(max_length=100, default="India")

    address_line_1 = models.CharField(max_length=255, blank=True, null=True)
    locality_area_street = models.CharField(max_length=255, blank=True, null=True)
    locality = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, blank=True, null=True)

    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "address_line_1", "locality_area_street", "city", "pincode")

    def save(self, *args, **kwargs):
        # If this address is marked as default, unset others for the same user
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.address_name.title()}, {self.city} - {self.pincode}"
