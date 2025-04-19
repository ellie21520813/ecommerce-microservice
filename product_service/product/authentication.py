from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .auth_helpers import get_user_details

EXEMPT_PATH = [
    '/admin/',
    '/favicon.ico/',
    '/product/',
    '/category/'
]


class JWTAuthMiddleware(MiddlewareMixin):
    def process_request(self, request):
        for path in EXEMPT_PATH:
            if request.path.startswith(path):
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
