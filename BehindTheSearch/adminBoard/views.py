from django.shortcuts import render,redirect, get_object_or_404
from django.contrib import messages
from .decorators import superuser_required
from users.models import CustomUser
from .utils import searchusers


@superuser_required
def dashboard(request):
    return render(request, 'adminBoard/dashboard.html')

@superuser_required
def getUsers(request):
    users = CustomUser.objects.filter(access=True,is_superuser=False)
    users, search_query = searchusers(request)
    context = {'users':users,'search_query':search_query}
    return render(request, 'adminBoard/users.html',context)

@superuser_required
def getUser(request,pk):
    user = CustomUser.objects.get(id = pk)
    context = {'user':user}
    return render (request,'adminBoard/single-user.html',context)

@superuser_required
def ban_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    user.access = False
    user.save()
    messages.success(request, f'User {user.username} has been banned.')
    return redirect('users')

@superuser_required
def delete_user(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    user.delete()
    messages.success(request, f'User {user.username} has been deleted.')
    return redirect('users')

