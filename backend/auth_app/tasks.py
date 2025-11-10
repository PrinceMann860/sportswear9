from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .email import send_otp_email, send_signup_success_email

@shared_task(bind=True, max_retries=3)
def send_otp_email_task(self, email, otp, purpose):
    """Send OTP email asynchronously."""
    try:
        send_otp_email(email, otp, purpose)
        return f"OTP email sent to {email}"
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)

@shared_task(bind=True, max_retries=3)
def send_signup_success_email_task(self, email):
    """Send signup success email asynchronously."""
    try:
        send_signup_success_email(email)
        return f"Signup success email sent to {email}"
    except Exception as exc:
        raise self.retry(exc=exc, countdown=5)

@shared_task
def debug_email_task():
    send_mail(
        "Celery Email Test",
        "This confirms Celery + RabbitMQ + Redis integration.",
        settings.DEFAULT_FROM_EMAIL,
        ["you@example.com"],
    )
    return "Email task executed"
