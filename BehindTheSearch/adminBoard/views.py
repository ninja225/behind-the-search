from django.shortcuts import render
from .decorators import superuser_required
from users.models import CustomUser


@superuser_required
def dashboard(request):
    return render(request, 'adminBoard/dashboard.html')

@superuser_required
def getUsers(request):
    users = CustomUser.objects.filter(access=True,is_superuser=False)
    context = {'users':users}
    return render(request, 'adminBoard/users.html',context)

@superuser_required
def getUser(request,pk):
    user = CustomUser.objects.get(id = pk)
    context = {'user':user}
    return render (request,'adminBoard/single-user.html',context)
