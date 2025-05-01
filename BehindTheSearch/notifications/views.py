from django.shortcuts import render
from django.contrib.auth.decorators import user_passes_test
from .models import Notification

def superuser_required(view_func):
    return user_passes_test(lambda u: u.is_superuser)(view_func)

@superuser_required
def notification_list(request):
    notifications = request.user.notifications.all().order_by('-timestamp')
    return render(request, 'notifications/list.html', {'notifications': notifications})
