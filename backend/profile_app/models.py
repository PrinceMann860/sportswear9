from django.db import models
from django.conf import settings

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
    phone = models.CharField(max_length=20, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return f"{self.full_name or self.user.email}'s Profile"


class Address(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="addresses")

    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=20)
    pincode = models.CharField(max_length=10)
    house_number = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    locality = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    address_type = models.CharField(
        max_length=50, choices=[("home", "Home"), ("office", "Office")], default="home"
    )
    is_default = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "house_number", "street", "locality", "city", "pincode")

    def __str__(self):
        return f"{self.name}, {self.city} - {self.pincode}"
