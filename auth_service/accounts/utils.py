from django.core.mail import EmailMessage
from django.conf import settings
import random
from django.contrib.sites.shortcuts import get_current_site

from .models import User, OTP


def sen_generaled_otp(email, request):
    subject = "One time passcode for Email verification"
    otp = random.randint(1000, 9999)
    current_site = get_current_site(request).domain
    user = User.objects.get(email=email)
    email_body = f"Hi {user.name} thanks for signing up on {current_site} please verify your email with the \n one time passcode {otp}"
    from_email = settings.EMAIL_HOST
    otp_obj = OTP.objects.create(user=user, otp=otp)

    send_email = EmailMessage(subject=subject, from_email=from_email, body=email_body, to=[email])
    send_email.send()


def send_normal_email(data):
    email = EmailMessage(subject=data['email_subject'], body=data['email_body'], from_email=settings.EMAIL_HOST,
                         to=[data['email']])
    email.send()
