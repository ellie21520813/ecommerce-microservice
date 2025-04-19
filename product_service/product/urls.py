from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt.views import TokenRefreshView

from .views import VendorViewSet, ProductViewSet, CategoryViewSet, MyProductViewSet
from rest_framework_simplejwt.views import (TokenRefreshView,)


router = routers.DefaultRouter()

router.register(r'vendor', VendorViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'product', ProductViewSet)
router.register(r'my-product', MyProductViewSet, basename='my-products')


urlpatterns = [
    path('api/v1/', include(router.urls)),


]