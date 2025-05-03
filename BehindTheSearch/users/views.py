from django.shortcuts import render,redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from . models import CustomUser
def loginUser(request):
    if request.user.is_authenticated:
        if request.user.access == False:
            return redirect('waiting-page')
        else :
            return redirect('video_list')

    if request.method == 'POST':
        username = request.POST['username'].lower()
        password = request.POST['password']

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            messages.error(request, 'Username does not exist')
            return render(request, 'users/login.html')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if user.access == False:
                return redirect('waiting-page')
            else:
                return redirect('video_list')
        else:
            messages.error(request, "Username or Password is incorrect")

    return render(request, 'users/login.html')

def registerUser(request):
    if request.user.is_authenticated:
        if request.user.access == False:
            return redirect('waiting-page')
        else :
            return redirect('video_list')
    form = CustomUserCreationForm()
    if request.method == "POST":
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit = False)
            user.username = user.username.lower()
            user.save()
    context = {'form':form}
    return redirect('login')
    return render (request,'users/register.html',context)

def logoutUser(request):
    logout(request)
    return redirect('landing-page')

def landingPage(request):
    return render(request,'landing-p.html')

def waitingPage(request):
    if request.user.is_authenticated:
        if request.user.access == True:
            return redirect('video_list')

    return render(request,'waiting-p.html')



