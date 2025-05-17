import re
from django.conf import settings

class CSRFExemptMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Compile a list of URL patterns that should be exempt from CSRF
        self.csrf_exempt_urls = getattr(settings, 'CSRF_EXEMPT_URLS', [])
        self.csrf_exempt_url_patterns = [re.compile(url) for url in self.csrf_exempt_urls]

    def __call__(self, request):
        # Check if the request path matches any pattern that should be exempt
        path = request.path_info.lstrip('/')
        
        # Special handling for the admin login
        if path.startswith('admin/login/'):
            request._dont_enforce_csrf_checks = True
        else:
            # Check if path matches any exempt pattern
            if any(pattern.match(path) for pattern in self.csrf_exempt_url_patterns):
                request._dont_enforce_csrf_checks = True
                
        response = self.get_response(request)
        return response 