from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField


class CustomUser (AbstractUser):
    phone_number = PhoneNumberField(max_length=15, null=False, blank=False)
    email = models.EmailField( max_length=254, unique=True, null=False, blank=False)
    access=models.BooleanField(default=False)
