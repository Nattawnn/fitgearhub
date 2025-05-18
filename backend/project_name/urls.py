from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.contrib.auth.views import LoginView
from django.views.decorators.csrf import csrf_exempt
from django.views.static import serve
import os

def health_check(request):
    return JsonResponse({'status': 'ok', 'message': 'FitGearHub backend is running'})

# Customize admin URL patterns to exempt the admin login from CSRF
admin.site.login = csrf_exempt(admin.site.login)

# Custom media file serving view for production
def serve_media_file(request, path):
    # Full path to the media file
    media_root = settings.MEDIA_ROOT
    full_path = os.path.join(media_root, path)
    print(f"Serving media file: {path}")
    print(f"Full path: {full_path}")
    print(f"File exists: {os.path.exists(full_path)}")
    # Use Django's built-in serve view
    return serve(request, path, document_root=media_root)

urlpatterns = [
    path('', health_check, name='health-check'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # Explicitly serve media files in both development and production
    path('media/<path:path>', serve_media_file, name='serve_media'),
]

# Add static/media URLs for development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Add some debug information
print(f"Media URL: {settings.MEDIA_URL}")
print(f"Media Root: {settings.MEDIA_ROOT}")
print(f"Debug mode: {settings.DEBUG}")
