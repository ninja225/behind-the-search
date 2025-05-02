from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='admin-dashboard'),
    path('users', views.getUsers, name='users'),
    path('user/<str:pk>/', views.getUser, name='user'),
]