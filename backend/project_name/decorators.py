from functools import wraps
from django.views.decorators.csrf import csrf_exempt

def disable_csrf(view_func):
    """
    Decorator that disables CSRF protection for a specific view function
    """
    @wraps(view_func)
    @csrf_exempt
    def wrapped_view(*args, **kwargs):
        return view_func(*args, **kwargs)
    return wrapped_view 