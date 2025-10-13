from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model
from .models import EmailOTP
from .serializers import (
    SendOTPSerializer,
    VerifyOTPSerializer,
    SetPasswordSerializer,
    LoginSerializer,
    RegisterSerializer
)
from .email import send_signup_success_email, send_otp_email
from .utils import generate_otp
from profile_app.models import UserProfile  # assuming separate profile app

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from .jwtToken import create_jwt_tokens


User = get_user_model()
GOOGLE_CLIENT_ID = settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY


# STEP 1: Send OTP
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({"detail": "User registered. OTP sent to email."})


# STEP 2: Verify OTP
class VerifyOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        otp = serializer.validated_data["otp"]

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found."}, status=404)

        otp_obj = EmailOTP.objects.filter(
            user=user, code=otp, purpose="VERIFY", used=False
        ).order_by("-created_at").first()

        if not otp_obj:
            return Response({"detail": "Invalid OTP"}, status=400)
        if otp_obj.is_expired():
            return Response({"detail": "OTP expired"}, status=400)

        otp_obj.used = True
        otp_obj.save()
        user.is_active = True
        user.save()

        send_signup_success_email(email)
        tokens = create_jwt_tokens(user)
        return Response({
            "detail": "Email verified and user logged in.",
            **tokens
        })


# STEP 3: Set Password
class SetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=404)

        user.set_password(password)
        user.save()

        send_signup_success_email(email)
        tokens = create_jwt_tokens(user)
        return Response({
            "detail": "Password set successfully. Proceed to login.",
            **tokens
        })


# STEP 4: Login (email or phone)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data["identifier"]
        password = serializer.validated_data["password"]

        user = User.objects.filter(email__iexact=identifier).first()

        # Search by phone if not found
        if not user:
            from profile_app.models import UserProfile
            profile = UserProfile.objects.filter(phone=identifier).select_related("user").first()
            user = profile.user if profile else None

        if not user:
            return Response({"detail": "User not found."}, status=404)

        if not user.is_active:
            return Response({"detail": "Account inactive. Verify your email."}, status=403)

        if not user.has_usable_password():
            return Response({
                "detail": "Account exists but password not set. Please reset your password.",
                "next": "reset_password"
            }, status=403)

        if not user.check_password(password):
            return Response({"detail": "Incorrect password"}, status=400)

        tokens = create_jwt_tokens(user)
        return Response(tokens)


# STEP 5: Forgot password (send OTP)
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "No user found"}, status=404)

        otp = generate_otp()
        EmailOTP.objects.create(user=user, code=otp, purpose="RESET")
        send_otp_email(email, otp, "RESET")
        return Response({"detail": "Password reset OTP sent."})


# STEP 6: Reset password (after OTP verify)
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        password = request.data.get("password")
        confirm = request.data.get("confirm_password")

        if password != confirm:
            return Response({"detail": "Passwords do not match"}, status=400)

        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"detail": "User not found"}, status=404)

        otp_obj = EmailOTP.objects.filter(
            user=user, code=otp, purpose="RESET", used=False
        ).first()
        if not otp_obj or otp_obj.is_expired():
            return Response({"detail": "Invalid or expired OTP"}, status=400)

        otp_obj.used = True
        otp_obj.save()

        user.set_password(password)
        user.save()

        send_signup_success_email(email)
        tokens = create_jwt_tokens(user)
        return Response({
            "detail": "Password reset successful. Proceed to login.",
            **tokens
        })


# STEP 7: GOOGLE OAUTH
class GoogleLoginJWTView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("access_token")
        if not token:
            return Response({"error": "Token missing"}, status=400)

        try:
            idinfo = id_token.verify_oauth2_token(
                token, google_requests.Request(), GOOGLE_CLIENT_ID
            )
            email = idinfo["email"]
            given_name = idinfo.get("given_name", "")
            family_name = idinfo.get("family_name", "")

            user, _ = User.objects.get_or_create(email=email)
            user.is_active = True
            user.save()

            UserProfile.objects.get_or_create(
                user=user,
                defaults={"full_name": f"{given_name} {family_name}"}
            )

            tokens = create_jwt_tokens(user)
            return Response(tokens)

        except ValueError:
            return Response({"error": "Invalid token"}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

class IsAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "is_admin": user.is_staff or user.is_superuser,
            "email": user.email,
            "user_uuid": user.user_uuid,
        })