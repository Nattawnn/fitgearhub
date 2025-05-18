from rest_framework import viewsets, filters, parsers, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, ProductImage
from .serializers import ProductSerializer, CategorySerializer
import os
from django.conf import settings

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'name']
    # Add support for multipart data
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    
    def create(self, request, *args, **kwargs):
        print(f"Create request data: {request.data}")
        print(f"Files included: {request.FILES}")
        
        # Check for media directory
        media_root = settings.MEDIA_ROOT
        products_dir = os.path.join(media_root, 'products')
        
        print(f"Media root path: {media_root}")
        print(f"Products dir path: {products_dir}")
        print(f"Media root exists: {os.path.exists(media_root)}")
        print(f"Products dir exists: {os.path.exists(products_dir)}")
        
        # Create directories if needed
        os.makedirs(media_root, exist_ok=True)
        os.makedirs(products_dir, exist_ok=True)
        
        # Make directories writable
        try:
            import stat
            os.chmod(media_root, stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO)
            os.chmod(products_dir, stat.S_IRWXU | stat.S_IRWXG | stat.S_IRWXO)
            print("Set permissions on media directories")
        except Exception as e:
            print(f"Error setting permissions: {e}")
        
        # Proceed with standard creation
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        print(f"Update request data: {request.data}")
        print(f"Files included: {request.FILES}")
        return super().update(request, *args, **kwargs)
