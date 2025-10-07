from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

def send_otp_email(email, otp, purpose):
    if purpose == "VERIFY":
        subject = "Verify your email address"
        template = "email/otp_email.html"
    else:
        subject = "Reset your password"
        template = "email/password_reset_email.html"

    html_message = render_to_string(template, {"otp": otp})
    send_mail(
        subject=subject,
        message=f"Your OTP code is {otp}",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
    )


def send_signup_success_email(email):
    subject = "Welcome to [Your Brand Name]!"
    html_message = render_to_string("email/signup_success_email.html")
    send_mail(
        subject=subject,
        message="Welcome aboard!",
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[email],
        html_message=html_message,
    )
