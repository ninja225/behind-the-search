from django.contrib.auth.decorators import user_passes_test

def superuser_required(view_func):
    return user_passes_test(lambda u: u.is_superuser)(view_func)