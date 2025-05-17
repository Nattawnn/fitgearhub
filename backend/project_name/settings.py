import os
import dj_database_url
from pathlib import Path
from dotenv import load_dotenv
import sys

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-development-key-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'drf_yasg',
    'django_filters',
    'apps.core',
    'apps.products',
    'apps.users',
    'apps.orders',
    'apps.cart',
    'apps.checkout',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'project_name.middleware.CSRFExemptMiddleware',  # Custom CSRF exemption middleware
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project_name.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project_name.wsgi.application'

# Database configuration
# Default to SQLite for local development and testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
        'TEST': {
            'NAME': BASE_DIR / 'test_db.sqlite3',
        },
    }
}

# If DATABASE_URL is in environment, use that (for Render deployment)
DATABASE_URL = os.environ.get('DATABASE_URL')
if DATABASE_URL:
    # Try to use the DATABASE_URL if provided
    try:
        DATABASES['default'] = dj_database_url.parse(DATABASE_URL)
        print(f"Using database configuration from DATABASE_URL")
        
        # Check if we need to set up the database from scratch
        if '--run-syncdb' in sys.argv:
            print("Will set up database tables from scratch")
        else:
            # Test the connection
            from django.db import connections
            try:
                connections['default'].ensure_connection()
                print("Database connection test successful")
            except Exception as e:
                print(f"Error connecting to database: {e}")
                print("Falling back to SQLite database")
                # Keep using the default SQLite database if connection fails
                DATABASES['default'] = {
                    'ENGINE': 'django.db.backends.sqlite3',
                    'NAME': BASE_DIR / 'db.sqlite3',
                }
    except Exception as e:
        print(f"Error setting up database: {e}")
        print("Falling back to SQLite database")
        # Keep using the default SQLite database
        pass

# Use SQLite for testing
if 'test' in sys.argv or os.environ.get('CI') == 'true':
    DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db_test.sqlite3',
    }
    print("Using SQLite for testing")

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
}

# CORS settings
CORS_ALLOW_ALL_ORIGINS = True  # Only for development
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://fitgearhub-frontend.onrender.com',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# CSRF settings
CSRF_TRUSTED_ORIGINS = [
    'https://fitgearhub-backend.onrender.com',
    'https://fitgearhub-frontend.onrender.com',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
]

# Define paths that should be exempt from CSRF
CSRF_EXEMPT_URLS = [
    r'^api/.*$',  # Exempt all API endpoints
    r'^admin/login/.*$',  # Exempt admin login
]

# Session settings - Only set secure cookies in production
if DEBUG:
    SESSION_COOKIE_SECURE = False
    CSRF_COOKIE_SECURE = False
    SESSION_COOKIE_SAMESITE = 'Lax'
    CSRF_COOKIE_SAMESITE = 'Lax'
else:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SAMESITE = 'None'  # Required for cross-domain cookies
    CSRF_COOKIE_SAMESITE = 'None'
    
    # HTTPS settings
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True

# Disable CSRF for API endpoints in development (unsafe for production)
if DEBUG:
    # Optional: Create a list of URLs that should be exempt from CSRF
    CSRF_EXEMPT_URLS = [r'^api/.*$']
    
    # Import and use CSRF exempt middleware if in development
    MIDDLEWARE = [
        middleware for middleware in MIDDLEWARE 
        if middleware != 'django.middleware.csrf.CsrfViewMiddleware'
    ] + ['django.middleware.csrf.CsrfViewMiddleware']
