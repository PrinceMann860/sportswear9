from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,TokenRefreshView,)
from .views import (
    RegisterView,  # NEW
    VerifyOTPView,
    LoginView,
    ForgotPasswordView,
    ResetPasswordView,
    GoogleLoginJWTView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),  # NEW
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("login/", LoginView.as_view(), name="login"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("google/token/", GoogleLoginJWTView.as_view(), name="google-jwt"),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
