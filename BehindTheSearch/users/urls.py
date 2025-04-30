from django.urls import path, include
from . import views

urlpatterns = [
    path('register/',views.registerUser,name = 'register'),
    path('login/',views.loginUser,name = 'login'),
    path('logout/',views.logoutUser,name = 'logout'),

]