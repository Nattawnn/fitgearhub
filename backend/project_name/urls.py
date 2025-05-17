from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.contrib.auth.views import LoginView
from django.views.decorators.csrf import csrf_exempt

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'FitGearHub backend is running'})

# Customize admin URL patterns to exempt the admin login from CSRF
admin.site.login = csrf_exempt(admin.site.login)

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
