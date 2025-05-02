from django.shortcuts import render
from .decorators import superuser_required
from users.models import CustomUser
@superuser_required
def dashboard(request):
    users = CustomUser.objects.filter(access=True)
    context = {'users':users}
    return render(request, 'adminBoard/dashboard.html',context)
