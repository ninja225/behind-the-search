from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .decorators import superuser_required
from users.models import CustomUser
from .utils import searchusers
from django.http import JsonResponse
from content.models import VideoSection, CourseVideo

# {pass data to Ninja Front}


@superuser_required
def dashboard(request):
    total_users = CustomUser.objects.filter(is_superuser=False).count()
    active_users = CustomUser.objects.filter(
        access=True, is_superuser=False).count()
    waiting_users = CustomUser.objects.filter(
        access=False, is_superuser=False).count()
    total_videos = CourseVideo.objects.count()
    total_sections = VideoSection.objects.count()

    context = {
        'total_users': total_users,
        'active_users': active_users,
        'waiting_users': waiting_users,
        'total_videos': total_videos,
        'total_sections': total_sections,
    }
    return render(request, 'adminBoard/dashboard.html', context)

# {pass data to Ninja Front}


@superuser_required
def dashboard_stats(request):
    """API endpoint for dashboard statistics"""
    total_users = CustomUser.objects.filter(is_superuser=False).count()
    active_users = CustomUser.objects.filter(
        access=True, is_superuser=False).count()
    waiting_users = CustomUser.objects.filter(
        access=False, is_superuser=False).count()
    total_videos = CourseVideo.objects.count()
    total_sections = VideoSection.objects.count()

    return JsonResponse({
        'total_users': total_users,
        'active_users': active_users,
        'waiting_users': waiting_users,
        'total_videos': total_videos,
        'total_sections': total_sections,
    })


@superuser_required
def getUsers(request):
    users = CustomUser.objects.filter(access=True, is_superuser=False)
    users, search_query = searchusers(request)
    context = {'users': users, 'search_query': search_query}
    return render(request, 'adminBoard/users.html', context)


@superuser_required
def getUser(request, pk):
    user = CustomUser.objects.get(id=pk)
    context = {'user': user}
    return render(request, 'adminBoard/single-user.html', context)


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
