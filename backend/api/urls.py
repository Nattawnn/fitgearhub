from django.urls import path, include
from rest_framework.routers import DefaultRouter
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from rest_framework import permissions
from rest_framework import routers
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.db import IntegrityError

schema_view = get_schema_view(
    openapi.Info(
        title="FitGearHub API",
        default_version='v1',
        description="FitGearHub API Documentation",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = routers.DefaultRouter()

# Create superuser API endpoint (temporary)
def create_superuser(request):
    try:
        if User.objects.filter(username='admin').exists():
            return JsonResponse({'message': 'Superuser already exists'})
        
        # Create a superuser - CHANGE PASSWORD IN PRODUCTION
        User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123456'
        )
        return JsonResponse({'message': 'Superuser created successfully!'})
    except IntegrityError:
        return JsonResponse({'message': 'Superuser creation failed. User may already exist.'})
    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'})

urlpatterns = [
    path('', include('apps.products.urls')),
    path('', include('apps.cart.urls')),
    path('', include('apps.checkout.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # API documentation
    path('', include(router.urls)),
    # Add this temporary endpoint - REMOVE AFTER CREATING ADMIN
    path('create-superuser/', create_superuser, name='create-superuser'),
]
