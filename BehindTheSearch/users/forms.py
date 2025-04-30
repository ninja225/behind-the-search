from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ['first_name','email','username','password1','password2','phone_number']
        labels = {
            'first_name':'Name',
        }