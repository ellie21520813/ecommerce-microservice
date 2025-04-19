
from django.urls import path, include
from rest_framework import routers

from .views import (
    UserViewSet, RegisterView, VerifyUserEmail, LoginUserView, PasswordResetConfirm,
    PasswordResetRequestView, SetNewPasswordView, LogoutApiView, TestingAuthenticatedReq, verified_token
)
from rest_framework_simplejwt.views import (TokenRefreshView,)


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api/signup/', RegisterView.as_view(), name='register'),
    path('api/verify-email/', VerifyUserEmail.as_view(), name='verify-email'),
    path('api/login/', LoginUserView.as_view(), name='login'),
    path('api/logout/', LogoutApiView.as_view(), name='logout'),
    path('api/password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('api/password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='reset-password-confirm'),
    path('api/set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/get-something/', TestingAuthenticatedReq.as_view(), name='just-for-testing'),
    path('api/verified-token/', verified_token, name='verified-token')


]
