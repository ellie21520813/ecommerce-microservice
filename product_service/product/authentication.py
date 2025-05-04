import re
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .auth_helpers import get_user_details

EXEMPT_PATH = [
    re.compile(r'^/api/v1/product/?$'),
    re.compile(r'^/api/v1/product/.*$'),
    re.compile(r'^/api/v1/category/?$'),
    re.compile(r'^/api/v1/category/.*$'),
    re.compile(r'^/admin/'),
    re.compile(r'^/favicon.ico/?$'),
    re.compile(r'^/favicon.ico/.*$'),
    re.compile(r'^/media/?$'),
    re.compile(r'^/media/.*$'),
    re.compile(r'^/static/?$'),
    re.compile(r'^/static/?$'),

]


class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        path = request.path
        if any(pattern.match(path) for pattern in EXEMPT_PATH):
            return None

        token = request.headers.get('Authorization')
        if not token:
            return JsonResponse({"detail": "Authorization header missing."}, status=401)

        user_data, error = get_user_details(token)
        if not user_data:
            return JsonResponse({"detail": f"Invalid token: {error}"}, status=401)
        request.user_id = user_data.get('user')
        print("user", request.user_id)
        request.is_vendor = user_data.get('is_vendor')
        return None
