from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()

@receiver(user_logged_in)
def notify_superusers_on_login(sender, request, user, **kwargs):
    message = f"{user.username} has logged in."
    superusers = User.objects.filter(is_superuser=True)

    for superuser in superusers:
        Notification.objects.create(recipient=superuser, message=message)
