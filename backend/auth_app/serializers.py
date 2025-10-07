from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmailOTP
from .utils import generate_otp
from .email import send_otp_email

User = get_user_model()


class SendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def create(self, validated_data):
        email = validated_data["email"]
        user, created = User.objects.get_or_create(email=email)
        otp = generate_otp()
        EmailOTP.objects.create(user=user, code=otp, purpose="VERIFY")
        send_otp_email(email, otp, "VERIFY")
        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class SetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data


class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField()
    password = serializers.CharField(write_only=True)


# serializers.py

class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField()
    gender = serializers.ChoiceField(choices=["M", "F", "O"])  # Or your app's gender choices
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match")
        return data

    def create(self, validated_data):
        from profile_app.models import UserProfile  # Assuming separate profile app
        full_name = validated_data.pop("full_name")
        gender = validated_data.pop("gender")
        email = validated_data["email"]
        password = validated_data["password"]

        user, created = User.objects.get_or_create(email=email)
        if not created and user.is_active:
            raise serializers.ValidationError("User with this email already exists")

        user.set_password(password)
        user.is_active = False
        user.save()

        # Create profile
        UserProfile.objects.update_or_create(
            user=user,
            defaults={
                "full_name": full_name,
                "gender": gender
            }
        )

        # Generate and send OTP
        otp = generate_otp()
        EmailOTP.objects.create(user=user, code=otp, purpose="VERIFY")
        send_otp_email(email, otp, "VERIFY")

        return user
